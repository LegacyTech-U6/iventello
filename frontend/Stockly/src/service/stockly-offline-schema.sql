-- Stockly Offline-First: Schéma SQLite compatible Sequelize
-- (À utiliser côté PWA pour le mode offline)

PRAGMA foreign_keys = ON;

-- Table Product
CREATE TABLE IF NOT EXISTS Product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Prod_name TEXT NOT NULL,
  entreprise_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 0,
  selling_price REAL NOT NULL,
  cost_price REAL NOT NULL,
  Prod_Description TEXT,
  code_bar TEXT,
  date_of_arrival TEXT,
  Prod_image TEXT,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  createdAt TEXT,
  updatedAt TEXT,
  UNIQUE(Prod_name, entreprise_id),
  FOREIGN KEY (entreprise_id) REFERENCES Entreprise(id)
);

-- Table Entreprise
CREATE TABLE IF NOT EXISTS Entreprise (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT UNIQUE,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XAF',
  description TEXT,
  logo_url TEXT,
  numero_fiscal TEXT,
  nui TEXT,
  adresse TEXT,
  ville TEXT,
  code_postal TEXT,
  email_contact TEXT,
  telephone_contact TEXT,
  informations_bancaires TEXT,
  created_at TEXT
);

-- Table User
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  Last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active INTEGER DEFAULT 0,
  activation_token TEXT,
  created_at TEXT,
  updated_at TEXT
);

-- Table Activity
CREATE TABLE IF NOT EXISTS Activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  description TEXT,
  amount REAL,
  quantity INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES User(id)
);

-- Table Notification
CREATE TABLE IF NOT EXISTS Notification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id INTEGER,
  read INTEGER DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (user_id) REFERENCES User(id)
);

-- Table Category
CREATE TABLE IF NOT EXISTS Category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table Client
CREATE TABLE IF NOT EXISTS Client (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  client_Signature TEXT,
  client_PhoneNumber TEXT,
  location TEXT,
  email TEXT,
  image TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table CurrencyRate
CREATE TABLE IF NOT EXISTS CurrencyRate (
  base TEXT PRIMARY KEY,
  rates TEXT NOT NULL, -- JSON string
  updatedAt TEXT NOT NULL
);

-- Table DailyPurchaseReport
CREATE TABLE IF NOT EXISTS DailyPurchaseReport (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  total_purchases REAL DEFAULT 0,
  total_items_purchased INTEGER DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  average_purchase REAL DEFAULT 0,
  top_products TEXT DEFAULT '[]', -- JSON string
  purchases_by_supplier TEXT DEFAULT '[]', -- JSON string
  details TEXT DEFAULT '[]', -- JSON string
  entreprise_id INTEGER NOT NULL,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (entreprise_id) REFERENCES Entreprise(id)
);

-- Table Invoice
CREATE TABLE IF NOT EXISTS Invoice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_echeance TEXT,
  status TEXT DEFAULT 'en_attente',
  payment_method TEXT DEFAULT 'espece',
  total REAL NOT NULL,
  reduction_type TEXT DEFAULT 'percentage',
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  general_total REAL NOT NULL,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table FactureItem
CREATE TABLE IF NOT EXISTS FactureItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  tva REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (invoice_id) REFERENCES Invoice(id)
);

-- Table Order
CREATE TABLE IF NOT EXISTS 'Order' (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  updated_at TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table Purchase
CREATE TABLE IF NOT EXISTS Purchase (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_name TEXT NOT NULL,
  payment_method TEXT DEFAULT 'espece',
  total REAL NOT NULL,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table PurchaseItem
CREATE TABLE IF NOT EXISTS PurchaseItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER,
  quantity INTEGER NOT NULL,
  unit_cost REAL NOT NULL,
  tva INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT,
  FOREIGN KEY (purchase_id) REFERENCES Purchase(id)
);

-- Table Role
CREATE TABLE IF NOT EXISTS Role (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table Sales
CREATE TABLE IF NOT EXISTS Sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quantity_sold INTEGER NOT NULL,
  total_price REAL NOT NULL,
  total_profit REAL NOT NULL,
  sale_date TEXT DEFAULT (datetime('now')),
  createdAt TEXT,
  updatedAt TEXT
);

-- Table DailySalesReport
CREATE TABLE IF NOT EXISTS DailySalesReport (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  total_sales REAL DEFAULT 0,
  total_items_sold INTEGER DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  average_sale REAL DEFAULT 0,
  top_products TEXT,
  sales_by_category TEXT,
  details TEXT,
  entreprise_id INTEGER NOT NULL,
  createdAt TEXT,
  updatedAt TEXT,
  UNIQUE(date, entreprise_id),
  FOREIGN KEY (entreprise_id) REFERENCES Entreprise(id)
);

-- Table Setting
CREATE TABLE IF NOT EXISTS Setting (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stock_alert_threshold INTEGER DEFAULT 5,
  createdAt TEXT,
  updatedAt TEXT
);

-- Table Supplier
CREATE TABLE IF NOT EXISTS Supplier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_name TEXT NOT NULL,
  supplier_address TEXT,
  phone_number TEXT,
  email TEXT,
  whatsapp_number TEXT,
  preferred_channel TEXT DEFAULT 'email',
  createdAt TEXT,
  updatedAt TEXT
);

-- Table Worker
CREATE TABLE IF NOT EXISTS Worker (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT,
  date_of_birth TEXT,
  email TEXT UNIQUE,
  name TEXT,
  position TEXT,
  date_hired TEXT,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'inactive',
  phone_number TEXT,
  address TEXT,
  created_at TEXT
);

-- Table AllUser
CREATE TABLE IF NOT EXISTS AllUser (
  id INTEGER PRIMARY KEY,
  email TEXT,
  password_hash TEXT,
  type TEXT
);
-- Table pour suivre les modifications locales à envoyer au serveur
CREATE TABLE IF NOT EXISTS SyncQueue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,    -- Ex: 'Product', 'Client'
  entity_id INTEGER NOT NULL,    -- L'ID local de l'enregistrement
  operation TEXT NOT NULL,      -- 'INSERT', 'UPDATE', ou 'DELETE'
  change_data TEXT,             -- Les données au format JSON
  created_at TEXT DEFAULT (datetime('now')),
  synced INTEGER DEFAULT 0       -- 0 = en attente, 1 = réussi
);