# Optimització ClientsVendes Database

## 📋 Índex de Continguts

1. [Estructura de la Base de Dades](#estructura)
2. [Relacions i Cardinalitat](#relacions)
3. [Taules Detallades](#taules)
4. [Consultes Clau](#consultes)
5. [Bones Pràctiques Aplicades](#bones-practiques)
6. [API Endpoints](#api)
7. [Migracions i Manteniment](#migracions)

---

## <a name="estructura"></a>📐 Estructura de la Base de Dades

La base de dades ha estat dissenyada seguint la **Tercera Forma Normal (3NF)** per garantir:
- ✅ Integritat referencial
- ✅ Evitar redundància de dades
- ✅ Facilitar la mantenibilitat
- ✅ Escalabilitat per a creixement futur

### Diagrama Conceptual

```
┌──────────────┐         ┌─────────────┐
│   CLIENTS    │◄────────┤   VENDES    │
│ (1) ───→ (N) │         │ (Cardinalitat │
└──────────────┘         │    1:N)      │
      │                  └─────────────┘
      │ clients.id
      │ ↓ (FK)
      ├──> vendes.client_id

┌──────────────────────┐    ┌──────────────────────┐
│DESPESES_HABITUALS    │◄───┤  REGISTRE_DESPESES   │
│ (1) ───────→ (N)     │    │ (Cardinalitat 1:N)   │
└──────────────────────┘    └──────────────────────┘
      │ despeses_id
      │ ↓ (FK)
      └──> registre_despeses.despesa_habitual_id
```

---

## <a name="relacions"></a>🔗 Relacions i Cardinalitat

### 1️⃣ **Clients ↔ Vendes (1:N - Un a Molts)**
- **Definició**: Un client pot tenir múltiples vendes. Cada venda pertany a un únic client.
- **FK**: `vendes.client_id` → `clients.id`
- **Constraint**: `ON DELETE CASCADE` → Eliminar un client eliminarà automàticament totes les seves vendes
- **Integritat**: La clau forana garanteix que no es pugui inserir una venda amb un `client_id` inexistent

### 2️⃣ **DespesesHabituals ↔ RegistreDespeses (1:N - Un a Molts)**
- **Definició**: Una despesa habitual (plantilla) pot tenir múltiples registres. Cada registre correspon a una única despesa.
- **FK**: `registre_despeses.despesa_habitual_id` → `despeses_habituals.id`
- **Constraint**: `ON DELETE RESTRICT` → No permetre eliminar una despesa habitual si té registres actius
- **Lògica**: Evita pèrdua accidental de dades històriques

### 3️⃣ **Vendes ↔ Despeses (Independents)**
- **Relació**: No hi ha connexió directa entre taules
- **Lògica**: Permet fer balanços globals: **Benefici = SUMA(Vendes) - SUMA(Despeses)**
- **Ús**: Calcular resultats mensuals o anuals sense vincular clients a despeses

---

## <a name="taules"></a>📊 Taules Detallades

### 🧑‍💼 Taula: `clients`

```sql
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,        -- Identificador únic
    name TEXT NOT NULL UNIQUE,                   -- Nom del client (sense duplicats)
    phone TEXT,                                  -- Telèfon de contacte
    email TEXT UNIQUE CHECK (email LIKE '%_@_%._%'),  -- Email vàlid (única)
    address TEXT,                                -- Adreça de domicili
    notepad TEXT DEFAULT '',                     -- Notes lliure text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Datacontacte registrada
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP    -- Data última modificació
);
```

**Índexs**:
- `idx_clients_email` - Per cerques per email
- `idx_clients_name` - Per cerques per nom
- `idx_clients_created_at` - Per filtrar per data de creació

---

### 💰 Taula: `vendes`

```sql
CREATE TABLE vendes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Identificador únic
    client_id INTEGER NOT NULL,                     -- Referència al client
    product TEXT NOT NULL,                          -- Nom del producte/servei
    price REAL NOT NULL CHECK (price >= 0),        -- Preu (no negatiu)
    date TEXT DEFAULT CURRENT_TIMESTAMP,            -- Data de la venda
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data registre creació
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data última actualització
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```

**Índexs**:
- `idx_vendes_client_id` - Per cerques per client
- `idx_vendes_date` - Per filtrar per data
- `idx_vendes_created_at` - Per historial

**Validació**:
- Price >= 0 (evita preus negatius)
- product no pot ser buit
- client_id ha d'existir en `clients`

---

### 🏷️ Taula: `despeses_habituals`

```sql
CREATE TABLE despeses_habituals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Identificador
    name TEXT NOT NULL UNIQUE,                      -- Tipus de despesa (ex: Lloguer)
    import_defecte REAL NOT NULL CHECK (...),      -- Importe estàndard
    descripcio TEXT DEFAULT '',                     -- Descripció detallada
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Propòsit**: Definir un catàleg de despeses recurrents per agilitzar l'entrada de dades.

---

### 📝 Taula: `registre_despeses`

```sql
CREATE TABLE registre_despeses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Identificador
    despesa_habitual_id INTEGER NOT NULL,           -- Link a despesa habitual
    import_real REAL NOT NULL CHECK (...),         -- Importe real gastat
    data DATETIME DEFAULT CURRENT_TIMESTAMP,        -- Data del gast
    anotacio TEXT DEFAULT '',                       -- Notes (ex: motiu variació)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (despesa_habitual_id) REFERENCES despeses_habituals(id) ON DELETE RESTRICT
);
```

**Propòsit**: Enregistrar cada instància real d'una despesa, separant la plantilla de l'execució.

---

## <a name="consultes"></a>📊 Consultes Clau

### ✅ Total de Vendes per Client

```sql
SELECT 
    c.id,
    c.name,
    COUNT(v.id) as total_vendes,
    COALESCE(SUM(v.price), 0) as total_amount,
    MAX(v.date) as ultima_venda
FROM clients c
LEFT JOIN vendes v ON c.id = v.client_id
GROUP BY c.id, c.name
ORDER BY total_amount DESC;
```

---

### ✅ Balanç Mensual (Benefici = Vendes - Despeses)

```sql
SELECT 
    strftime('%Y-%m', v.date) as mes,
    COALESCE(SUM(v.price), 0) as total_vendes,
    (SELECT COALESCE(SUM(r2.import_real), 0) 
     FROM registre_despeses r2 
     WHERE strftime('%Y-%m', r2.data) = strftime('%Y-%m', v.date)) as total_despeses,
    (COALESCE(SUM(v.price), 0) - 
     (SELECT COALESCE(SUM(r2.import_real), 0) 
      FROM registre_despeses r2 
      WHERE strftime('%Y-%m', r2.data) = strftime('%Y-%m', v.date))) as benefici_net
FROM vendes v
GROUP BY strftime('%Y-%m', v.date)
ORDER BY mes DESC;
```

---

### ✅ Despeses Reals vs Pressupost

```sql
SELECT 
    dh.name,
    dh.import_defecte * COUNT(rd.id) as pressupost,
    COALESCE(SUM(rd.import_real), 0) as real,
    (COALESCE(SUM(rd.import_real), 0) - (dh.import_defecte * COUNT(rd.id))) as diferencia
FROM despeses_habituals dh
LEFT JOIN registre_despeses rd ON dh.id = rd.despesa_habitual_id
GROUP BY dh.id;
```

---

## <a name="bones-practiques"></a>✨ Bones Pràctiques Aplicades

### 1. **Normalització (3NF)**
- ✅ Cada taula representa un concepte únic
- ✅ Cap dependència funcional incompleta
- ✅ Cap dependència funcional transitiva
- ✅ Evita redundància i inconsistències

### 2. **Integritat Referencial**
- ✅ Claus primàries `INTEGER PRIMARY KEY AUTOINCREMENT`
- ✅ Claus foranyes amb `ON DELETE CASCADE` o `ON DELETE RESTRICT`
- ✅ Validació de dades amb `CHECK` constraints
- ✅ PRAGMA `foreign_keys = ON` activat

### 3. **Tipus de Dades Correctes**
- ✅ `REAL` per a imports (suporta decimals)
- ✅ `INTEGER` per a comptadors
- ✅ `DATETIME` per a marques de temps
- ✅ `TEXT` per a blocs de notes i descripcions

### 4. **Índexs per a Optimització**
- ✅ `idx_clients_email` - Cerques ràpides per email
- ✅ `idx_clients_name` - Cerques per nom
- ✅ `idx_vendes_client_id` - JOINs eficients
- ✅ `idx_vendes_date` - Filtres per períodes
- ✅ `idx_registre_despeses_data` - Reportes mensuals

### 5. **Timestamps Automàtics**
- ✅ `created_at` - Quan es va crear el registre
- ✅ `updated_at` - Quan es va modificar per últim cop
- ✅ Triggers automàtics per mantenir `updated_at`

### 6. **Validació de Dades**
- ✅ CHECK constraints per a preus no negatius
- ✅ NOT NULL per a camps essencials
- ✅ UNIQUE per a emails i noms de clients
- ✅ Validació de format email

---

## <a name="api"></a>🌐 API Endpoints

### Clients
```
GET /api/clients                    # Obtenir tots els clients
GET /api/clients/:id                # Obtenermit un client específic
POST /api/clients                   # Crear o actualitzar client
```

### Vendes
```
GET /api/vendes                     # Obtenir totes les vendes
GET /api/vendes/client/:client_id   # Vendes d'un client
POST /api/vendes                    # Crear venda
DELETE /api/vendes/:id              # Eliminar venda
```

### Despeses Habituals
```
GET /api/despeses-habituals         # Llistat de despeses
POST /api/despeses-habituals        # Crear nova despesa habitual
```

### Registre Despeses
```
GET /api/registre-despeses          # Totes les despeses registrades
POST /api/registre-despeses         # Enregistrar nova despesa
```

### Reports
```
GET /api/reports/vendes-per-client  # Totals per client
GET /api/reports/balanc-mensual     # Balanç mensual (benefici)
```

---

## <a name="migracions"></a>🔄 Migracions i Manteniment

### Primera Vegada (Nova BD)
1. Executar `dbSchema.sql` per crear l'estructura
2. Els triggers s'activaran automàticament
3. Els índexs milloran el rendiment immediatament

### Migració de Dades Legacy
Si vienes d'una estructura anterior amb taula `expenses`:

```sql
-- Copiar dades
INSERT INTO vendes (client_id, product, price, date)
SELECT client_id, product, price, date 
FROM expenses
WHERE product IS NOT NULL AND price IS NOT NULL;

-- Verificar integritat
SELECT * FROM vendes 
WHERE client_id NOT IN (SELECT id FROM clients);
```

### Verificar Integritat
```sql
-- Comprovar integritat referencial
PRAGMA foreign_keys = ON;
PRAGMA integrity_check;
```

### Backup Regular
```bash
# El servidor crea backups mensuals automàticament
# Ubicació: Base de Dades Mensual/Clients_01-MM-YYYY.db
```

---

## 📈 Exemples Pràctics

### Crear un Client
```json
POST /api/clients
{
    "name": "Empresa ABC",
    "phone": "933123456",
    "email": "contact@empresaabc.com",
    "address": "Carrer Principal 123, Barcelona",
    "notepad": "Client actiu, pagament normal"
}
```

### Registrar una Venda
```json
POST /api/vendes
{
    "client_id": 1,
    "product": "Servei de disseny",
    "price": 500.00,
    "date": "2026-01-28"
}
```

### Crear Despesa Habitual
```json
POST /api/despeses-habituals
{
    "name": "Lloguer",
    "import_defecte": 2000.00,
    "descripcio": "Lloguer mensual del local"
}
```

### Registrar Despesa Real
```json
POST /api/registre-despeses
{
    "despesa_habitual_id": 1,
    "import_real": 2050.00,
    "anotacio": "Increment de 50€ per revisió estructural"
}
```

---

## 🎯 Conclusió

Aquesta estructura garanteix:
- ✅ **Integritat**: FK, constraints i validació
- ✅ **Rendiment**: Índexs optimitzats
- ✅ **Escalabilitat**: Disseny 3NF professional
- ✅ **Mantenibilitat**: Codi clar i bem documentat
- ✅ **Seguretat**: Protecció contra inconsistències

L'aplicació ClientsVendes passa a ser una solució **professional i robusta** per a gestió CRUD de petites empreses.
