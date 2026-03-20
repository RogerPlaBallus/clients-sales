// ============================================================================
// In-browser SQLite database layer powered by sql.js / WebAssembly.
// The bundled Clients.db file is used as seed data only.
// All user changes are stored inside the current browser and never written back
// to the deployed .db file.
// ============================================================================

const SQL_WASM_VERSION = '1.10.3';
const BROWSER_DB_NAME = 'clientsvendes-portfolio-demo';
const BROWSER_DB_STORE = 'snapshots';
const BROWSER_DB_KEY = 'active-database';

let SQL = null;
let db = null;
let persistQueue = Promise.resolve();

async function initBrowserDB() {
    SQL = await initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${SQL_WASM_VERSION}/${file}`
    });

    try {
        const initialBytes = await loadInitialDatabaseBytes();
        db = initialBytes ? new SQL.Database(initialBytes) : new SQL.Database();
    } catch (error) {
        console.warn('Stored browser database could not be opened. Falling back to the bundled seed database.', error);
        await clearPersistedDatabaseBytes();

        const fallbackBytes = await fetchBundledDatabaseBytes();
        db = fallbackBytes ? new SQL.Database(fallbackBytes) : new SQL.Database();
    }

    ensureSchema();
}

async function loadInitialDatabaseBytes() {
    const persistedBytes = await readPersistedDatabaseBytes();
    if (persistedBytes) {
        return persistedBytes;
    }

    return fetchBundledDatabaseBytes();
}

async function fetchBundledDatabaseBytes() {
    try {
        const response = await fetch('./Clients.db', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Could not fetch Clients.db (${response.status})`);
        }

        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    } catch (error) {
        console.warn('Could not load Clients.db, falling back to an empty browser database.', error);
        return null;
    }
}

function ensureSchema() {
    db.run('PRAGMA foreign_keys = ON');
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            phone TEXT,
            email TEXT,
            address TEXT,
            notepad TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS vendes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            product TEXT NOT NULL,
            price REAL NOT NULL CHECK (price >= 0),
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS productes_serveis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price REAL NOT NULL CHECK (price >= 0),
            descripcio TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CHECK (length(name) > 0)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS despeses_habituals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            import_defecte REAL NOT NULL CHECK (import_defecte >= 0),
            descripcio TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS registre_despeses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            despesa_habitual_id INTEGER NOT NULL,
            import_real REAL NOT NULL CHECK (import_real >= 0),
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            anotacio TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (despesa_habitual_id) REFERENCES despeses_habituals(id) ON DELETE RESTRICT
        )
    `);
}

function queryRows(sql, params = []) {
    const statement = db.prepare(sql, params);
    const rows = [];

    try {
        while (statement.step()) {
            rows.push(statement.getAsObject());
        }
    } finally {
        statement.free();
    }

    return rows;
}

function queryRow(sql, params = []) {
    return queryRows(sql, params)[0] || null;
}

function getLastInsertedId() {
    const row = queryRow('SELECT last_insert_rowid() AS id');
    return row ? row.id : null;
}

function normaliseDate(value) {
    if (!value) {
        return new Date().toISOString().slice(0, 10);
    }

    return String(value).split('T')[0].split(' ')[0];
}

function queueBrowserDbPersist() {
    persistQueue = persistQueue
        .then(() => persistBrowserDb())
        .catch((error) => {
            console.error('Error persisting browser database:', error);
        });

    return persistQueue;
}

async function persistBrowserDb() {
    if (!db) {
        return;
    }

    await writePersistedDatabaseBytes(db.export());
}

async function resetBrowserDB() {
    await persistQueue;
    await clearPersistedDatabaseBytes();

    const freshBytes = await fetchBundledDatabaseBytes();
    if (db) {
        db.close();
    }

    db = freshBytes ? new SQL.Database(freshBytes) : new SQL.Database();
    ensureSchema();
    await persistBrowserDb();
}

async function openBrowserDatabaseStore() {
    if (!('indexedDB' in window)) {
        throw new Error('IndexedDB is not available in this browser.');
    }

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(BROWSER_DB_NAME, 1);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(BROWSER_DB_STORE)) {
                database.createObjectStore(BROWSER_DB_STORE);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB.'));
    });
}

async function readPersistedDatabaseBytes() {
    if (!('indexedDB' in window)) {
        return null;
    }

    const database = await openBrowserDatabaseStore();

    try {
        return await new Promise((resolve, reject) => {
            const transaction = database.transaction(BROWSER_DB_STORE, 'readonly');
            const request = transaction.objectStore(BROWSER_DB_STORE).get(BROWSER_DB_KEY);

            request.onsuccess = () => {
                const storedValue = request.result;
                if (!storedValue) {
                    resolve(null);
                    return;
                }

                if (storedValue instanceof Uint8Array) {
                    resolve(storedValue);
                    return;
                }

                resolve(new Uint8Array(storedValue));
            };
            request.onerror = () => reject(request.error || new Error('Failed to read browser database.'));
        });
    } finally {
        database.close();
    }
}

async function writePersistedDatabaseBytes(bytes) {
    if (!('indexedDB' in window)) {
        return;
    }

    const database = await openBrowserDatabaseStore();

    try {
        await new Promise((resolve, reject) => {
            const transaction = database.transaction(BROWSER_DB_STORE, 'readwrite');
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('Failed to save browser database.'));
            transaction.objectStore(BROWSER_DB_STORE).put(bytes, BROWSER_DB_KEY);
        });
    } finally {
        database.close();
    }
}

async function clearPersistedDatabaseBytes() {
    if (!('indexedDB' in window)) {
        return;
    }

    const database = await openBrowserDatabaseStore();

    try {
        await new Promise((resolve, reject) => {
            const transaction = database.transaction(BROWSER_DB_STORE, 'readwrite');
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('Failed to clear browser database.'));
            transaction.objectStore(BROWSER_DB_STORE).delete(BROWSER_DB_KEY);
        });
    } finally {
        database.close();
    }
}

// ============================================================================
// Client API
// ============================================================================

function apiGetClients() {
    const clients = queryRows(`
        SELECT id, name, phone, email, address, notepad, created_at, updated_at
        FROM clients
        ORDER BY name ASC
    `);

    return clients.map((client) => ({
        ...client,
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        notepad: client.notepad || '',
        vendes: queryRows(`
            SELECT id, date, product, price
            FROM vendes
            WHERE client_id = ?
            ORDER BY date DESC, id DESC
        `, [client.id]).map((venda) => ({
            ...venda,
            date: normaliseDate(venda.date)
        }))
    }));
}

function apiPostClient({ name, phone, email, address, notepad }) {
    const trimmedName = String(name || '').trim();
    if (!trimmedName) {
        throw new Error('Name is required');
    }

    try {
        db.run(
            'INSERT INTO clients (name, phone, email, address, notepad) VALUES (?, ?, ?, ?, ?)',
            [trimmedName, phone || null, email || null, address || '', notepad || '']
        );
    } catch (error) {
        if (!String(error.message || '').includes('UNIQUE constraint failed')) {
            throw error;
        }

        db.run(
            `UPDATE clients
             SET phone = ?, email = ?, address = ?, notepad = ?, updated_at = CURRENT_TIMESTAMP
             WHERE name = ?`,
            [phone || null, email || null, address || '', notepad || '', trimmedName]
        );
    }

    queueBrowserDbPersist();

    return {
        message: 'Client saved successfully',
        client: queryRow('SELECT * FROM clients WHERE name = ?', [trimmedName])
    };
}

function apiPutClient(id, { name, phone, email, address, notepad }) {
    db.run(
        `UPDATE clients
         SET name = ?, phone = ?, email = ?, address = ?, notepad = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [String(name || '').trim(), phone || '', email || '', address || '', notepad || '', id]
    );

    queueBrowserDbPersist();

    return {
        message: 'Client updated successfully',
        client: queryRow('SELECT * FROM clients WHERE id = ?', [id])
    };
}

function apiDeleteClient(id) {
    db.run('DELETE FROM clients WHERE id = ?', [id]);
    queueBrowserDbPersist();

    return { message: 'Client deleted successfully' };
}

// ============================================================================
// Sales API
// ============================================================================

function apiPostVenda({ client_id, product, price, date }) {
    const trimmedProduct = String(product || '').trim();
    if (!client_id || !trimmedProduct || price === undefined || Number.isNaN(Number(price))) {
        throw new Error('Missing required sale fields');
    }

    db.run(
        'INSERT INTO vendes (client_id, product, price, date) VALUES (?, ?, ?, ?)',
        [client_id, trimmedProduct, Number(price), normaliseDate(date)]
    );

    const lastId = getLastInsertedId();
    queueBrowserDbPersist();

    return {
        message: 'Sale created successfully',
        venda: queryRow('SELECT * FROM vendes WHERE id = ?', [lastId])
    };
}

function apiDeleteVenda(id) {
    db.run('DELETE FROM vendes WHERE id = ?', [id]);
    queueBrowserDbPersist();

    return { message: 'Sale deleted successfully' };
}

// ============================================================================
// Saved products / services API
// ============================================================================

function apiGetProductes() {
    return queryRows(`
        SELECT *
        FROM productes_serveis
        ORDER BY name ASC
    `);
}

function apiPostProducte({ name, price, descripcio }) {
    const trimmedName = String(name || '').trim();
    if (!trimmedName || price === undefined || Number.isNaN(Number(price))) {
        throw new Error('Missing required product/service fields');
    }

    db.run(
        'INSERT INTO productes_serveis (name, price, descripcio) VALUES (?, ?, ?)',
        [trimmedName, Number(price), descripcio || '']
    );

    const lastId = getLastInsertedId();
    queueBrowserDbPersist();

    return {
        message: 'Product/Service created successfully',
        producte_servei: queryRow('SELECT * FROM productes_serveis WHERE id = ?', [lastId])
    };
}

function apiDeleteProducte(id) {
    db.run('DELETE FROM productes_serveis WHERE id = ?', [id]);
    queueBrowserDbPersist();

    return { message: 'Product/Service deleted successfully' };
}

// ============================================================================
// Export current browser snapshot
// ============================================================================

function apiExportDb() {
    return new Blob([db.export()], { type: 'application/octet-stream' });
}
