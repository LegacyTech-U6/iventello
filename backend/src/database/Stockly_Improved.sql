-- ============================================================
-- 📦 STOCKLY DATABASE SCHEMA (POSTGRESQL)
-- Architecture complète avec audit trail, versioning et offline support
-- ============================================================

-- ============================================================
-- PART 1: ENUMS & TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin_saas', 'entreprise_admin', 'gestionnaire_stock', 'caissier', 'comptable', 'viewer');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'sent', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'cheque', 'mobile_money');
CREATE TYPE contact_preference AS ENUM ('email', 'whatsapp', 'phone', 'sms');
CREATE TYPE movement_type AS ENUM ('in', 'out', 'adjustment', 'return', 'loss');
CREATE TYPE sync_status AS ENUM ('pending', 'synced', 'conflict', 'failed');

-- ============================================================
-- PART 2: CORE USERS & AUTH
-- ============================================================

-- Utilisateurs administrateurs SaaS (niveau plateforme)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  activation_token VARCHAR(255),
  activation_token_expires_at TIMESTAMP,
  last_login_at TIMESTAMP,
  
  -- Audit trail
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning pour sync
  version INT DEFAULT 1,
  
  CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CHECK (telephone ~ '^\+?[0-9\s\-()]{7,20}$' OR telephone IS NULL)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- ============================================================
-- PART 3: ENTREPRISES (Multi-tenancy core)
-- ============================================================

-- Entreprises clientes SaaS
CREATE TABLE entreprises (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  
  -- Information légale
  tax_id VARCHAR(50) UNIQUE,              -- SIRET/SIREN
  business_registration_id VARCHAR(50),   -- Numéro d'immatriculation
  nui VARCHAR(50) UNIQUE,                 -- National Unique ID
  
  -- Contact
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(255),
  
  -- Adresse
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2),
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Banque
  bank_name VARCHAR(255),
  iban VARCHAR(34),
  swift_code VARCHAR(11),
  
  -- Configuration
  currency_code VARCHAR(3) DEFAULT 'USD',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  is_verified BOOLEAN DEFAULT false,
  
  -- Audit trail
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1
);

CREATE INDEX idx_entreprises_owner_id ON entreprises(owner_id);
CREATE INDEX idx_entreprises_status ON entreprises(status);
CREATE INDEX idx_entreprises_deleted_at ON entreprises(deleted_at);
CREATE INDEX idx_entreprises_uuid ON entreprises(uuid);

-- ============================================================
-- PART 4: USERS MANAGEMENT (Rôles & Permissions)
-- ============================================================

-- Rôles globaux
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions granulaires
CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  resource VARCHAR(50),          -- 'products', 'invoices', etc.
  action VARCHAR(20),            -- 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relation rôles-permissions
CREATE TABLE role_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- Utilisateurs au niveau entreprise (avec rôle spécifique)
CREATE TABLE entreprise_users (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  
  -- Permissions additionnelles (override)
  additional_permissions JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, user_id)
);

CREATE INDEX idx_entreprise_users_entreprise_id ON entreprise_users(entreprise_id);
CREATE INDEX idx_entreprise_users_user_id ON entreprise_users(user_id);

-- Travailleurs/Employés (entité distincte de users)
CREATE TABLE workers (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- Lien optionnel vers user
  
  -- Info personnelle
  email VARCHAR(150) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  avatar_url VARCHAR(500),
  
  -- Position
  position VARCHAR(100),
  department VARCHAR(100),
  date_hired DATE,
  date_ended DATE,
  
  -- Contact
  phone VARCHAR(20),
  emergency_contact VARCHAR(255),
  
  -- Salaire (optionnel)
  hourly_rate DECIMAL(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, email)
);

CREATE INDEX idx_workers_entreprise_id ON workers(entreprise_id);
CREATE INDEX idx_workers_status ON workers(status);

-- ============================================================
-- PART 5: CATALOGS (Categories, Suppliers)
-- ============================================================

-- Catégories de produits
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,  -- Sous-catégories
  icon_url VARCHAR(500),
  display_order INT DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, name)
);

CREATE INDEX idx_categories_entreprise_id ON categories(entreprise_id);
CREATE INDEX idx_categories_parent_category_id ON categories(parent_category_id);

-- Fournisseurs
CREATE TABLE suppliers (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Contact principal
  contact_person VARCHAR(255),
  email VARCHAR(150),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  website VARCHAR(255),
  
  -- Adresse
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2),
  
  -- Préférence de contact
  preferred_contact_method contact_preference DEFAULT 'email',
  
  -- Conditions
  payment_terms VARCHAR(255),
  delivery_time_days INT,
  minimum_order_quantity DECIMAL(10,2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Rating
  rating DECIMAL(3,2),
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1
);

CREATE INDEX idx_suppliers_entreprise_id ON suppliers(entreprise_id);
CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);

-- Clients
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'individual' CHECK (type IN ('individual', 'company')),
  
  -- Contact
  email VARCHAR(150),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  website VARCHAR(255),
  
  -- Adresse
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2),
  
  -- Entreprise (si type = 'company')
  company_registration_id VARCHAR(50),
  tax_id VARCHAR(50),
  
  -- Préférence de contact
  preferred_contact_method contact_preference DEFAULT 'email',
  
  -- Crédit
  credit_limit DECIMAL(12,2),
  credit_used DECIMAL(12,2) DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Métadonnées
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1
);

CREATE INDEX idx_clients_entreprise_id ON clients(entreprise_id);
CREATE INDEX idx_clients_is_active ON clients(is_active);

-- ============================================================
-- PART 6: PRODUCTS & INVENTORY
-- ============================================================

-- Produits/Articles
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  
  -- Identification
  sku VARCHAR(100) NOT NULL,
  barcode VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Catégorie
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Prix (DECIMAL pour précision monétaire)
  cost_price DECIMAL(12,2) NOT NULL CHECK (cost_price >= 0),
  selling_price DECIMAL(12,2) NOT NULL CHECK (selling_price >= 0),
  wholesale_price DECIMAL(12,2),
  tax_rate DECIMAL(5,2) DEFAULT 0 CHECK (tax_rate >= 0),
  
  -- Stock
  quantity_on_hand INT DEFAULT 0 CHECK (quantity_on_hand >= 0),
  quantity_reserved INT DEFAULT 0 CHECK (quantity_reserved >= 0),
  quantity_available INT GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  min_stock_level INT DEFAULT 0,
  max_stock_level INT,
  reorder_quantity INT,
  
  -- Fournisseur principal
  primary_supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
  
  -- Images & Media
  image_url VARCHAR(500),
  
  -- Dates
  date_of_arrival DATE,
  date_manufactured DATE,
  date_expiry DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_discontinued BOOLEAN DEFAULT false,
  
  -- Métadonnées
  unit_of_measure VARCHAR(20) DEFAULT 'piece',  -- 'kg', 'liter', 'piece', etc.
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  supplier_part_number VARCHAR(100),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, sku)
);

CREATE INDEX idx_products_entreprise_id ON products(entreprise_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_supplier_id ON products(primary_supplier_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_quantity_on_hand ON products(quantity_on_hand);

-- Mouvements de stock (Audit trail du stock)
CREATE TABLE stock_movements (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Mouvement
  type movement_type NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  
  -- Raison
  reason TEXT,
  purchase_order_id BIGINT,
  sales_order_id BIGINT,
  
  -- Détails
  reference_number VARCHAR(100),
  notes TEXT,
  
  -- Location tracking (optionnel)
  warehouse_location VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  CHECK (quantity > 0)
);

CREATE INDEX idx_stock_movements_entreprise_id ON stock_movements(entreprise_id);
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);

-- ============================================================
-- PART 7: ORDERS (Achat/Approvisionnement)
-- ============================================================

CREATE TABLE purchase_orders (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  
  -- Identification
  po_number VARCHAR(100) NOT NULL,
  reference_number VARCHAR(100),
  
  -- Dates
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Statut
  status order_status DEFAULT 'pending',
  
  -- Montants
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  
  -- Paiement
  payment_method payment_method,
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  
  -- Notes
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, po_number)
);

CREATE INDEX idx_purchase_orders_entreprise_id ON purchase_orders(entreprise_id);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- Lignes de commande d'achat
CREATE TABLE purchase_order_items (
  id BIGSERIAL PRIMARY KEY,
  purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Quantité & Prix
  quantity_ordered DECIMAL(10,2) NOT NULL CHECK (quantity_ordered > 0),
  quantity_received DECIMAL(10,2) DEFAULT 0 CHECK (quantity_received >= 0),
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  tax_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Total
  line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_price * (1 + tax_rate / 100)) STORED,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK (quantity_received <= quantity_ordered)
);

CREATE INDEX idx_purchase_order_items_purchase_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product_id ON purchase_order_items(product_id);

-- ============================================================
-- PART 8: SALES & INVOICES
-- ============================================================

-- Factures/Invoices
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  
  -- Identification
  invoice_number VARCHAR(100) NOT NULL,
  reference_number VARCHAR(100),
  
  -- Dates
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  
  -- Statut
  status invoice_status DEFAULT 'draft',
  
  -- Montants
  subtotal DECIMAL(12,2) DEFAULT 0 CHECK (subtotal >= 0),
  discount_type VARCHAR(20) DEFAULT 'none' CHECK (discount_type IN ('none', 'percentage', 'fixed')),
  discount_value DECIMAL(12,2) DEFAULT 0 CHECK (discount_value >= 0),
  tax_amount DECIMAL(12,2) DEFAULT 0 CHECK (tax_amount >= 0),
  total DECIMAL(12,2) DEFAULT 0 CHECK (total >= 0),
  amount_paid DECIMAL(12,2) DEFAULT 0 CHECK (amount_paid >= 0 AND amount_paid <= total),
  amount_due DECIMAL(12,2) GENERATED ALWAYS AS (total - amount_paid) STORED,
  
  -- Paiement
  payment_method payment_method,
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP,
  
  -- Versioning
  version INT DEFAULT 1,
  
  UNIQUE(entreprise_id, invoice_number)
);

CREATE INDEX idx_invoices_entreprise_id ON invoices(entreprise_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Lignes de facture
CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Quantité & Prix
  quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  tax_rate DECIMAL(5,2) DEFAULT 0 CHECK (tax_rate >= 0),
  discount_amount DECIMAL(12,2) DEFAULT 0 CHECK (discount_amount >= 0),
  
  -- Total
  line_total DECIMAL(12,2) GENERATED ALWAYS AS ((quantity * unit_price * (1 + tax_rate / 100)) - discount_amount) STORED,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_product_id ON invoice_items(product_id);

-- Enregistrements de vente/Sales
CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE SET NULL,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Quantité
  quantity_sold INT NOT NULL CHECK (quantity_sold > 0),
  
  -- Montants
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  cost_price DECIMAL(12,2) NOT NULL CHECK (cost_price >= 0),
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity_sold * unit_price) STORED,
  total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity_sold * cost_price) STORED,
  profit DECIMAL(12,2) GENERATED ALWAYS AS (total_price - total_cost) STORED,
  margin_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((profit / total_price) * 100) STORED,
  
  -- Date
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_sales_entreprise_id ON sales(entreprise_id);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- ============================================================
-- PART 9: PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  invoice_id BIGINT REFERENCES invoices(id) ON DELETE SET NULL,
  purchase_order_id BIGINT REFERENCES purchase_orders(id) ON DELETE SET NULL,
  
  -- Montant
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  payment_method payment_method NOT NULL,
  
  -- Date
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Référence
  reference_number VARCHAR(100),
  notes TEXT,
  
  -- Statut
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_entreprise_id ON payments(entreprise_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_purchase_order_id ON payments(purchase_order_id);

-- ============================================================
-- PART 10: NOTIFICATIONS & ALERTS
-- ============================================================

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  
  -- Contenu
  type VARCHAR(50) NOT NULL,  -- 'low_stock', 'invoice_due', 'order_arrived', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Statut
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  -- Relation
  related_entity_type VARCHAR(50),
  related_entity_id BIGINT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- PART 11: ACTIVITY LOG (Audit Trail Complet)
-- ============================================================

CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action
  action VARCHAR(100) NOT NULL,  -- 'create', 'update', 'delete', 'view', etc.
  entity_type VARCHAR(50) NOT NULL,  -- 'product', 'invoice', 'client', etc.
  entity_id BIGINT,
  
  -- Changements
  changes JSONB,  -- {old: {...}, new: {...}}
  description TEXT,
  
  -- Métadonnées
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK (entity_id > 0 OR entity_id IS NULL)
);

CREATE INDEX idx_activity_logs_entreprise_id ON activity_logs(entreprise_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================
-- PART 12: SYNC METADATA (Pour offline support)
-- ============================================================

-- Suivi des changements pour synchronisation offline
CREATE TABLE sync_queue (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  
  -- Entity
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  
  -- Opération
  operation VARCHAR(20) NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  
  -- Données
  data JSONB,
  old_data JSONB,
  
  -- Statut de sync
  sync_status sync_status DEFAULT 'pending',
  sync_error TEXT,
  
  -- Versioning
  local_version INT,
  server_version INT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  synced_at TIMESTAMP,
  
  CHECK (entity_id > 0)
);

CREATE INDEX idx_sync_queue_entreprise_id ON sync_queue(entreprise_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(sync_status);
CREATE INDEX idx_sync_queue_created_at ON sync_queue(created_at);

-- Metadata pour versionning
CREATE TABLE entity_versions (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  version INT NOT NULL,
  data JSONB NOT NULL,
  changed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(entity_type, entity_id, version)
);

CREATE INDEX idx_entity_versions_entity ON entity_versions(entity_type, entity_id);

-- ============================================================
-- PART 13: SETTINGS & CONFIGURATIONS
-- ============================================================

CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  entreprise_id BIGINT NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
  
  -- Stock
  low_stock_threshold INT DEFAULT 5,
  auto_reorder BOOLEAN DEFAULT false,
  
  -- Invoicing
  invoice_prefix VARCHAR(20) DEFAULT 'INV',
  next_invoice_number INT DEFAULT 1,
  
  -- PO
  po_prefix VARCHAR(20) DEFAULT 'PO',
  next_po_number INT DEFAULT 1,
  
  -- Email
  send_invoice_on_create BOOLEAN DEFAULT true,
  send_payment_reminders BOOLEAN DEFAULT true,
  
  -- Données
  data JSONB DEFAULT '{}'::jsonb,
  
  UNIQUE(entreprise_id)
);

-- ============================================================
-- PART 14: CURRENCY RATES (Pour multi-devise)
-- ============================================================

CREATE TABLE currency_rates (
  id BIGSERIAL PRIMARY KEY,
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(12,6) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(base_currency, target_currency)
);

-- ============================================================
-- PART 15: VIEWS (Pour requêtes courantes)
-- ============================================================

-- Vue : Utilisateurs actifs avec rôles
CREATE VIEW v_active_users AS
SELECT 
  u.id,
  u.email,
  u.username,
  u.first_name,
  u.last_name,
  r.name AS role_name,
  eu.entreprise_id,
  u.created_at
FROM users u
LEFT JOIN entreprise_users eu ON u.id = eu.user_id AND eu.is_active = true
LEFT JOIN roles r ON eu.role_id = r.id
WHERE u.is_active = true AND u.deleted_at IS NULL;

-- Vue : Stock par entreprise
CREATE VIEW v_stock_summary AS
SELECT 
  p.entreprise_id,
  p.id AS product_id,
  p.name,
  p.sku,
  p.quantity_on_hand,
  p.min_stock_level,
  p.max_stock_level,
  p.quantity_available,
  CASE 
    WHEN p.quantity_on_hand <= p.min_stock_level THEN 'low'
    WHEN p.quantity_on_hand = 0 THEN 'out'
    WHEN p.quantity_on_hand >= p.max_stock_level THEN 'over'
    ELSE 'ok'
  END AS stock_status
FROM products p
WHERE p.deleted_at IS NULL;

-- Vue : Factures impayées
CREATE VIEW v_overdue_invoices AS
SELECT 
  i.id,
  i.invoice_number,
  c.name AS client_name,
  i.total,
  i.amount_due,
  i.due_date,
  CURRENT_DATE - i.due_date AS days_overdue
FROM invoices i
JOIN clients c ON i.client_id = c.id
WHERE i.status != 'paid' AND i.deleted_at IS NULL
  AND i.due_date < CURRENT_DATE;

-- Vue : Performance ventes par produit (30 derniers jours)
CREATE VIEW v_product_sales_30days AS
SELECT 
  p.id,
  p.name,
  SUM(s.quantity_sold) AS total_quantity,
  SUM(s.total_price) AS total_revenue,
  SUM(s.profit) AS total_profit,
  AVG(s.margin_percentage) AS avg_margin_pct,
  COUNT(*) AS transaction_count
FROM sales s
JOIN products p ON s.product_id = p.id
WHERE s.sale_date >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY p.id, p.name
ORDER BY total_revenue DESC;

-- ============================================================
-- DEFAULT DATA (Rôles de base)
-- ============================================================

INSERT INTO roles (name, description) VALUES
('admin_saas', 'Administrateur plateforme SaaS'),
('entreprise_admin', 'Administrateur entreprise'),
('gestionnaire_stock', 'Gestionnaire de stock'),
('caissier', 'Caissier/Point de vente'),
('comptable', 'Comptable'),
('viewer', 'Lecteur (consultation uniquement)');

INSERT INTO permissions (resource, action, name, description) VALUES
('products', 'create', 'create_product', 'Créer un produit'),
('products', 'read', 'read_product', 'Consulter les produits'),
('products', 'update', 'update_product', 'Modifier un produit'),
('products', 'delete', 'delete_product', 'Supprimer un produit'),
('invoices', 'create', 'create_invoice', 'Créer une facture'),
('invoices', 'read', 'read_invoice', 'Consulter les factures'),
('invoices', 'update', 'update_invoice', 'Modifier une facture'),
('invoices', 'delete', 'delete_invoice', 'Supprimer une facture'),
('reports', 'read', 'read_reports', 'Consulter les rapports'),
('settings', 'read', 'read_settings', 'Consulter les paramètres'),
('settings', 'update', 'update_settings', 'Modifier les paramètres');

-- ============================================================
-- DEFAULT PERMISSIONS MAPPING
-- ============================================================

-- Admin SaaS - tous les droits
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin_saas';

-- Entreprise Admin - tous les droits sauf paramètres
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'entreprise_admin' AND p.name NOT LIKE '%settings%';

-- Gestionnaire Stock
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'gestionnaire_stock' 
  AND p.resource IN ('products', 'reports')
  AND p.action IN ('create', 'read', 'update');

-- Caissier
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'caissier' 
  AND ((p.resource = 'products' AND p.action IN ('read'))
    OR (p.resource = 'invoices' AND p.action IN ('create', 'read')));

-- Comptable
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'comptable' 
  AND (p.resource IN ('invoices', 'reports') OR p.name = 'read_settings');

-- Viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'viewer' 
  AND p.action = 'read';

-- ============================================================
-- TRIGGERS (Automatic updates)
-- ============================================================

-- Auto update updated_at on users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  NEW.version = NEW.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Auto update updated_at on products
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  NEW.version = NEW.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products FOR EACH ROW
EXECUTE FUNCTION update_products_updated_at();

-- Décrémente stock automatiquement lors de la création d'une facture
CREATE OR REPLACE FUNCTION handle_invoice_item_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET quantity_on_hand = quantity_on_hand - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_item_stock
AFTER INSERT ON invoice_items FOR EACH ROW
EXECUTE FUNCTION handle_invoice_item_stock();

-- Log activity on product changes
CREATE OR REPLACE FUNCTION log_product_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (entreprise_id, user_id, action, entity_type, entity_id, changes, description)
  VALUES (
    NEW.entreprise_id,
    COALESCE(NEW.updated_by, (SELECT id FROM users LIMIT 1)),
    CASE WHEN TG_OP = 'DELETE' THEN 'delete' ELSE 'update' END,
    'product',
    NEW.id,
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
    'Produit "' || NEW.name || '" modifié'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_product_activity
AFTER UPDATE ON products FOR EACH ROW
EXECUTE FUNCTION log_product_activity();

