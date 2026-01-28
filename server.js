const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Database setup
const DB_PATH = 'Clients.db';

// ============================================================================
// BACKUP LOGIC
// ============================================================================

const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();
const currentMonthYear = `${month}-${year}`;

const backupDir = 'Base de Dades Mensual';
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

const files = fs.readdirSync(backupDir);
const exists = files.some(file => file.startsWith('Clients_') && file.includes(currentMonthYear) && file.endsWith('.db'));

if (now.getDate() === 1 && !exists) {
    const day = '01';
    const dateStr = `${day}-${month}-${year}`;
    const dest = path.join(backupDir, `Clients_${dateStr}.db`);
    fs.copyFileSync(DB_PATH, dest);
    console.log(`✅ Monthly backup created: ${dest}`);
}

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

function initializeDatabase() {
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('❌ Database connection error:', err.message);
        }
    });

    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON');

    // Create tables using serialize to ensure sequential execution
    db.serialize(() => {
        // Create clients table
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

        // Create vendes table
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

        // Create productes_serveis table (persistent products/services)
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

        // Create despeses_habituals table
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

        // Create registre_despeses table
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

        // Create all indexes
        db.run('CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)');
        db.run('CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name)');
        db.run('CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at)');
        db.run('CREATE INDEX IF NOT EXISTS idx_vendes_client_id ON vendes(client_id)');
        db.run('CREATE INDEX IF NOT EXISTS idx_vendes_date ON vendes(date)');
        db.run('CREATE INDEX IF NOT EXISTS idx_vendes_created_at ON vendes(created_at)');
        db.run('CREATE INDEX IF NOT EXISTS idx_productes_serveis_name ON productes_serveis(name)');
        db.run('CREATE INDEX IF NOT EXISTS idx_productes_serveis_created_at ON productes_serveis(created_at)');
        db.run('CREATE INDEX IF NOT EXISTS idx_despeses_habituals_name ON despeses_habituals(name)');
        db.run('CREATE INDEX IF NOT EXISTS idx_registre_despeses_despesa_id ON registre_despeses(despesa_habitual_id)');
        db.run('CREATE INDEX IF NOT EXISTS idx_registre_despeses_data ON registre_despeses(data)');
        db.run('CREATE INDEX IF NOT EXISTS idx_registre_despeses_created_at ON registre_despeses(created_at)', (err) => {
            if (err) {
                console.error('❌ Error initializing database:', err.message);
            } else {
                console.log('✅ Database schema initialized successfully');
            }
        });
    });

    return db;
}

// Initialize database
const db = initializeDatabase();

// ============================================================================
// API ROUTES - CLIENTS
// ============================================================================

// Get all clients with their sales (vendes)
app.get('/api/clients', (req, res) => {
    console.log('📝 GET /api/clients request received');
    
    const query = `
        SELECT 
            c.id, 
            c.name, 
            c.phone, 
            c.email, 
            c.address, 
            c.notepad,
            c.created_at,
            c.updated_at,
            (SELECT GROUP_CONCAT(JSON_OBJECT(
                'id', v.id,
                'date', v.date, 
                'product', v.product, 
                'price', v.price
            ))
            FROM vendes v
            WHERE v.client_id = c.id) as vendes
        FROM clients c
        ORDER BY c.name
    `;

    db.all(query, [], (err, rows) => {
        console.log('📝 DB callback received, err:', err, 'rows:', rows);
        
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        const clients = (rows || []).map(row => ({
            id: row.id,
            name: row.name,
            phone: row.phone || '',
            email: row.email || '',
            address: row.address || '',
            notepad: row.notepad || '',
            created_at: row.created_at,
            updated_at: row.updated_at,
            vendes: row.vendes ? JSON.parse(`[${row.vendes}]`) : []
        }));

        console.log('✅ Sending response');
        res.json(clients);
    });
});

// Get single client with details
app.get('/api/clients/:id', (req, res) => {
    const query = `
        SELECT c.*, 
               COUNT(v.id) as total_vendes,
               COALESCE(SUM(v.price), 0) as total_amount
        FROM clients c
        LEFT JOIN vendes v ON c.id = v.client_id
        WHERE c.id = ?
        GROUP BY c.id
    `;

    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(row);
    });
});

// Create or update client
app.post('/api/clients', (req, res) => {
    const { name, phone, email, address, notepad } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // First try to insert
    const insertQuery = `
        INSERT INTO clients (name, phone, email, address, notepad)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [name, phone || null, email || null, address || '', notepad || ''], function(err) {
        if (err && err.message.includes('UNIQUE constraint failed')) {
            // Client exists, update instead
            const updateQuery = `
                UPDATE clients
                SET phone = ?, email = ?, address = ?, notepad = ?, updated_at = CURRENT_TIMESTAMP
                WHERE name = ?
            `;
            db.run(updateQuery, [phone || null, email || null, address || '', notepad || '', name], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                db.get('SELECT * FROM clients WHERE name = ?', [name], (err, row) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Client saved successfully', client: row });
                });
            });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            db.get('SELECT * FROM clients WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Client saved successfully', client: row });
            });
        }
    });
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
    db.run('DELETE FROM clients WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Client deleted successfully' });
    });
});

// Update client
app.put('/api/clients/:id', (req, res) => {
    const { name, phone, email, address, notepad } = req.body;
    const clientId = req.params.id;

    const query = `
        UPDATE clients 
        SET name = ?, phone = ?, email = ?, address = ?, notepad = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(query, [name || '', phone || '', email || '', address || '', notepad || '', clientId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM clients WHERE id = ?', [clientId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: 'Client not found' });
            }
            res.json({ message: 'Client updated successfully', client: row });
        });
    });
});

// ============================================================================
// API ROUTES - VENDES (SALES)
// ============================================================================

// Get all sales
app.get('/api/vendes', (req, res) => {
    const query = `
        SELECT v.*, c.name as client_name
        FROM vendes v
        LEFT JOIN clients c ON v.client_id = c.id
        ORDER BY v.date DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Get sales for specific client
app.get('/api/vendes/client/:client_id', (req, res) => {
    const query = `
        SELECT * FROM vendes
        WHERE client_id = ?
        ORDER BY date DESC
    `;

    db.all(query, [req.params.client_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Create sale
app.post('/api/vendes', (req, res) => {
    const { client_id, product, price, date } = req.body;

    if (!client_id || !product || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO vendes (client_id, product, price, date)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [client_id, product, price, date || new Date().toISOString()], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM vendes WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Sale created successfully', venda: row });
        });
    });
});

// Delete sale
app.delete('/api/vendes/:id', (req, res) => {
    db.run('DELETE FROM vendes WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Sale deleted successfully' });
    });
});

// ============================================================================
// API ROUTES - PRODUCTES/SERVEIS (SAVED PRODUCTS & SERVICES)
// ============================================================================

// Get all saved products/services
app.get('/api/productes-serveis', (req, res) => {
    const query = `
        SELECT * FROM productes_serveis
        ORDER BY name ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Create product/service
app.post('/api/productes-serveis', (req, res) => {
    const { name, price, descripcio } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields (name and price)' });
    }

    const query = `
        INSERT INTO productes_serveis (name, price, descripcio)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name.trim(), price, descripcio || ''], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Product/Service with this name already exists' });
            }
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM productes_serveis WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Product/Service created successfully', producte_servei: row });
        });
    });
});

// Delete product/service
app.delete('/api/productes-serveis/:id', (req, res) => {
    db.run('DELETE FROM productes_serveis WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product/Service deleted successfully' });
    });
});

// Update product/service
app.put('/api/productes-serveis/:id', (req, res) => {
    const { name, price, descripcio } = req.body;
    const id = req.params.id;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields (name and price)' });
    }

    const query = `
        UPDATE productes_serveis
        SET name = ?, price = ?, descripcio = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(query, [name.trim(), price, descripcio || '', id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Product/Service with this name already exists' });
            }
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM productes_serveis WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: 'Product/Service not found' });
            }
            res.json({ message: 'Product/Service updated successfully', producte_servei: row });
        });
    });
});

// ============================================================================
// API ROUTES - DESPESES HABITUALS (RECURRING EXPENSES)
// ============================================================================

// Get all recurring expenses
app.get('/api/despeses-habituals', (req, res) => {
    const query = `
        SELECT dh.*,
               COUNT(rd.id) as total_registres
        FROM despeses_habituals dh
        LEFT JOIN registre_despeses rd ON dh.id = rd.despesa_habitual_id
        GROUP BY dh.id
        ORDER BY dh.name
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Create recurring expense
app.post('/api/despeses-habituals', (req, res) => {
    const { name, import_defecte, descripcio } = req.body;

    if (!name || import_defecte === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO despeses_habituals (name, import_defecte, descripcio)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name, import_defecte, descripcio || ''], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM despeses_habituals WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Recurring expense created', despesa: row });
        });
    });
});

// ============================================================================
// API ROUTES - REGISTRE DESPESES (EXPENSE RECORDS)
// ============================================================================

// Get all expense records
app.get('/api/registre-despeses', (req, res) => {
    const query = `
        SELECT rd.*, dh.name as despesa_name, dh.import_defecte
        FROM registre_despeses rd
        LEFT JOIN despeses_habituals dh ON rd.despesa_habitual_id = dh.id
        ORDER BY rd.data DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Create expense record
app.post('/api/registre-despeses', (req, res) => {
    const { despesa_habitual_id, import_real, anotacio } = req.body;

    if (!despesa_habitual_id || import_real === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO registre_despeses (despesa_habitual_id, import_real, anotacio)
        VALUES (?, ?, ?)
    `;

    db.run(query, [despesa_habitual_id, import_real, anotacio || ''], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM registre_despeses WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Expense record created', registre: row });
        });
    });
});

// ============================================================================
// API ROUTES - REPORTS & ANALYTICS
// ============================================================================

// Get sales per client
app.get('/api/reports/vendes-per-client', (req, res) => {
    const query = `
        SELECT 
            c.id,
            c.name,
            COUNT(v.id) as total_vendes,
            COALESCE(SUM(v.price), 0) as total_vendes_amount,
            MAX(v.date) as ultima_venda
        FROM clients c
        LEFT JOIN vendes v ON c.id = v.client_id
        GROUP BY c.id, c.name
        ORDER BY total_vendes_amount DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// Get monthly balance
app.get('/api/reports/balanc-mensual', (req, res) => {
    const querySQLite = `
        SELECT 
            DATE(data) as data,
            SUM(total_vendes) as total_vendes,
            SUM(total_despeses) as total_despeses,
            (SUM(total_vendes) - SUM(total_despeses)) as benefici_net
        FROM (
            SELECT 
                DATE(v.date) as data,
                SUM(v.price) as total_vendes,
                0 as total_despeses
            FROM vendes v
            GROUP BY DATE(v.date)
            
            UNION ALL
            
            SELECT 
                DATE(r.data) as data,
                0 as total_vendes,
                SUM(r.import_real) as total_despeses
            FROM registre_despeses r
            GROUP BY DATE(r.data)
        )
        GROUP BY DATE(data)
        ORDER BY data DESC
    `;

    db.all(querySQLite, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});

// ============================================================================
// DATABASE EXPORT / IMPORT
// ============================================================================

// Export database
app.get('/api/export-db', (req, res) => {
    if (!fs.existsSync(DB_PATH)) {
        return res.status(404).json({ error: 'Database not found' });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="clients.db"');

    const fileStream = fs.createReadStream(DB_PATH);
    fileStream.pipe(res);
});

// Import database
app.post('/api/import-db', upload.single('database'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const tempPath = req.file.path;
    const targetPath = DB_PATH;

    // Backup current database
    if (fs.existsSync(targetPath)) {
        const backupPath = targetPath + '.backup';
        fs.copyFileSync(targetPath, backupPath);
    }

    // Replace with uploaded database
    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to import database' });
        }

        db.close();
        const newDb = initializeDatabase();
        
        res.json({ message: 'Database imported successfully' });
    });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ ClientsVendes Server running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${DB_PATH}`);
    console.log(`${'='.repeat(60)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⏹️  Closing database connection...');
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Unexpected error:', err.message);
    console.error(err.stack);
    // Don't exit the process - server should continue running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    // Don't exit the process - server should continue running
});

// Also catch errors on the db object
db.on('error', (err) => {
    console.error('❌ Database error event:', err.message);
});

module.exports = app;
