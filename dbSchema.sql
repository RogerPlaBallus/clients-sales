-- ============================================================================
-- ESQUEMA OPTIMITZAT - ClientsVendes Database
-- Base de dades SQLite amb normalització 3NF i integritat referencial
-- ============================================================================

-- ============================================================================
-- TAULA 1: CLIENTS
-- Dada: Informació bàsica dels clients amb validació de dades
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    phone TEXT,
    email TEXT UNIQUE CHECK (email LIKE '%_@_%._%'),  -- Validació bàsica email
    address TEXT,
    notepad TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (length(name) > 0)
);

-- Índex per cerques freqüents
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- ============================================================================
-- TAULA 2: VENDES
-- Dada: Registre de vendes de productes/serveis vinculades a clients
-- Cardinalitat: Clients (1) --- (N) Vendes
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    product TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CHECK (length(product) > 0)
);

-- Índex per millor rendiment en cerques
CREATE INDEX IF NOT EXISTS idx_vendes_client_id ON vendes(client_id);
CREATE INDEX IF NOT EXISTS idx_vendes_date ON vendes(date);
CREATE INDEX IF NOT EXISTS idx_vendes_created_at ON vendes(created_at);

-- ============================================================================
-- TAULA 3: PRODUCTES_SERVEIS
-- Dada: Catàleg de productes o serveis guardats (plantilles reutilitzables)
-- Cardinalitat: Accesibles des de tots els clients (referència indirecta via vendes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS productes_serveis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    price REAL NOT NULL CHECK (price >= 0),
    descripcio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (length(name) > 0)
);

-- Índex per cerques i rendiment
CREATE INDEX IF NOT EXISTS idx_productes_serveis_name ON productes_serveis(name);
CREATE INDEX IF NOT EXISTS idx_productes_serveis_created_at ON productes_serveis(created_at);

-- ============================================================================
-- TAULA 4: DESPESES_HABITUALS
-- Dada: Catàleg de despeses recurrents (plantilles)
-- Cardinalitat: DespesesHabituals (1) --- (N) RegistreDespeses
-- ============================================================================
CREATE TABLE IF NOT EXISTS despeses_habituals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    import_defecte REAL NOT NULL CHECK (import_defecte >= 0),
    descripcio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (length(name) > 0)
);

-- Índex per cerques
CREATE INDEX IF NOT EXISTS idx_despeses_habituals_name ON despeses_habituals(name);

-- ============================================================================
-- TAULA 4: REGISTRE_DESPESES
-- Dada: Despeses reals efectuades (instances de les despeses habituals)
-- Cardinalitat: DespesesHabituals (1) --- (N) RegistreDespeses
-- ============================================================================
CREATE TABLE IF NOT EXISTS registre_despeses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    despesa_habitual_id INTEGER NOT NULL,
    import_real REAL NOT NULL CHECK (import_real >= 0),
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    anotacio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (despesa_habitual_id) REFERENCES despeses_habituals(id) ON DELETE RESTRICT,
    CHECK (length(anotacio) >= 0)
);

-- Índex per cerques
CREATE INDEX IF NOT EXISTS idx_registre_despeses_despesa_id ON registre_despeses(despesa_habitual_id);
CREATE INDEX IF NOT EXISTS idx_registre_despeses_data ON registre_despeses(data);
CREATE INDEX IF NOT EXISTS idx_registre_despeses_created_at ON registre_despeses(created_at);

-- ============================================================================
-- VISTES ÚTILS PER A CONSULTES FREQÜENTS
-- ============================================================================

-- Vista: Total de vendes per client
CREATE VIEW IF NOT EXISTS v_vendes_per_client AS
SELECT 
    c.id,
    c.name,
    COUNT(v.id) as total_vendes,
    COALESCE(SUM(v.price), 0) as total_vendes_amount,
    MAX(v.date) as ultima_venda
FROM clients c
LEFT JOIN vendes v ON c.id = v.client_id
GROUP BY c.id, c.name;

-- Vista: Balanç total (vendes vs despeses)
CREATE VIEW IF NOT EXISTS v_balanc_mensuales AS
SELECT 
    DATE(v.date) as data_venda,
    COALESCE(SUM(v.price), 0) as total_vendes,
    (SELECT COALESCE(SUM(r.import_real), 0) 
     FROM registre_despeses r 
     WHERE DATE(r.data) = DATE(v.date)) as total_despeses,
    (COALESCE(SUM(v.price), 0) - 
     (SELECT COALESCE(SUM(r.import_real), 0) 
      FROM registre_despeses r 
      WHERE DATE(r.data) = DATE(v.date))) as benefici_net
FROM vendes v
GROUP BY DATE(v.date)
ORDER BY data_venda DESC;

-- ============================================================================
-- TRIGGERS per actualitzar updated_at automàticament
-- ============================================================================

CREATE TRIGGER IF NOT EXISTS trigger_clients_updated
AFTER UPDATE ON clients
BEGIN
  UPDATE clients SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_vendes_updated
AFTER UPDATE ON vendes
BEGIN
  UPDATE vendes SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_productes_serveis_updated
AFTER UPDATE ON productes_serveis
BEGIN
  UPDATE productes_serveis SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_despeses_habituals_updated
AFTER UPDATE ON despeses_habituals
BEGIN
  UPDATE despeses_habituals SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_registre_despeses_updated
AFTER UPDATE ON registre_despeses
BEGIN
  UPDATE registre_despeses SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- ============================================================================
-- EXEMPLE DE DADES DE PROVA
-- ============================================================================

-- Insertar clientes de ejemplo
INSERT OR IGNORE INTO clients (id, name, phone, email, address, notepad)
VALUES 
    (1, 'Empresa ABC', '933123456', 'contact@empresaabc.com', 'Carrer Principal 123, Barcelona', 'Client actiu, pagament normal'),
    (2, 'Negoci XYZ', '934567890', 'info@negociXYZ.cat', 'Avinguda Major 456, Girona', 'Pagament cada 15 dies');

-- Insertar despeses habituals
INSERT OR IGNORE INTO despeses_habituals (id, name, import_defecte, descripcio)
VALUES 
    (1, 'Lloguer', 2000.00, 'Lloguer mensual del local'),
    (2, 'Subministraments', 150.00, 'Consumibles i material d''oficina'),
    (3, 'Internet i Teleonia', 80.00, 'Connexió internet i telèfon'),
    (4, 'Electricitat', 200.00, 'Factura d''electricitat');

-- ============================================================================
-- RELACIONS I CARDINALITAT (Documentació)
-- ============================================================================

-- Clients (1) ←→ (N) Vendes
--   • Un client pot tenir múltiples vendes
--   • Cada venda pertany a un únic client
--   • Si s'elimina un client, les seves vendes s'eliminen (CASCADE)

-- DespesesHabituals (1) ←→ (N) RegistreDespeses
--   • Una despesa habitual pot tenir múltiples registres
--   • Cada registre fa referència a una única despesa habitual
--   • Si s'intenta eliminar una despesa habitual, fallà si té registres (RESTRICT)

-- Vendes i Despeses (Independents)
--   • Les vendes estan vinculades a clients
--   • Les despeses són globals del negoci
--   • Permet calcular Benefici = SUMA(Vendes) - SUMA(Despeses)
