SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
DROP DATABASE IF EXISTS Stockly;
CREATE DATABASE IF NOT EXISTS Stockly;
USE Stockly;
SET NAMES utf8mb4;

-- =============================================================
-- Table principale des utilisateurs du SaaS
-- =============================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL,
  `Last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telephone` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table des rôles généraux
-- =============================================================
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- =============================================================
-- Table des permissions optionnelles
-- =============================================================
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `role_permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table des entreprises créées par les admins
-- =============================================================
CREATE TABLE `Entreprises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,                -- Identifiant interne
  `uuid` CHAR(36) NOT NULL UNIQUE,                    -- Identifiant universel unique
  `user_id` INT NOT NULL,                              -- Admin / propriétaire (SaaS)
  `name` VARCHAR(150) NOT NULL,                        -- Nom de l’entreprise
  `description` TEXT DEFAULT NULL,                     -- Description optionnelle
  `logo_url` VARCHAR(255) DEFAULT NULL,               -- Logo / branding
  `numero_fiscal` VARCHAR(50) DEFAULT NULL,          -- Numéro fiscal / SIRET / TIN
  `nui` VARCHAR(50) UNIQUE DEFAULT NULL,             -- Numéro d’Identification Unique
  `adresse` VARCHAR(500) DEFAULT NULL,               -- Rue et numéro
  `ville` VARCHAR(100) DEFAULT NULL,                 -- Ville
  `code_postal` VARCHAR(20) DEFAULT NULL,            -- Code postal
  `email_contact` VARCHAR(255) DEFAULT NULL,         -- Email du contact principal
  `telephone_contact` VARCHAR(50) DEFAULT NULL,      -- Téléphone du contact principal
  `informations_bancaires` VARCHAR(255) DEFAULT NULL, -- IBAN / compte bancaire
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date de création
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- Table des travailleurs (employés) liés à une entreprise
-- ============================================================
CREATE TABLE `Workers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image` VARCHAR(100),
  `date_of_birth` DATE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `name` VARCHAR(20),
  `entreprise_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `position` VARCHAR(100),
  `date_hired` DATE,
  `password_hash` VARCHAR(255) NOT NULL, 
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `role_id` INT,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =============================================================
-- Table des utilisateurs internes à une entreprise
-- =============================================================
CREATE TABLE `EntrepriseUsers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` ENUM('admin_entreprise','gestionnaire_stock','caissier','comptable') DEFAULT 'caissier',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Client
-- =============================================================
CREATE TABLE `Client` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `client_name` VARCHAR(255),
  `client_Signature` VARCHAR(255),
  `client_PhoneNumber` VARCHAR(20),
  `location` VARCHAR(255),
  `email` VARCHAR(50),
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Category
-- =============================================================
CREATE TABLE `Category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  UNIQUE (`entreprise_id`, `name`),
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Supplier
-- =============================================================
CREATE TABLE `Supplier` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `supplier_name` VARCHAR(255) NOT NULL,
  `supplier_address` VARCHAR(255),
  `phone_number` VARCHAR(50),
  `email` VARCHAR(255),
  `whatsapp_number` VARCHAR(50),
  `preferred_channel` ENUM('email', 'whatsapp', 'phone') DEFAULT 'email',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Product
-- =============================================================
CREATE TABLE `Product` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `Prod_name` VARCHAR(255) NOT NULL,
  `quantity` INT DEFAULT 0,
  `cost_price` INT NOT NULL,
  `selling_price` INT NOT NULL,
  `category_id` INT,
  `Prod_Description` TEXT,
  `code_bar` VARCHAR(255),
  `date_of_arrival` DATE,
  `supplier` INT,
  `Prod_image` VARCHAR(255),
  `min_stock_level` INT DEFAULT 0,
  `max_stock_level` INT DEFAULT NULL,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`supplier`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE SET NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Factures
-- =============================================================
CREATE TABLE `Factures` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `user_id` INT,
  `date_of_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `date_echeance` DATE,
  `status` ENUM('en_attente', 'payee', 'annulee') DEFAULT 'en_attente',
  `mode_paiement` VARCHAR(50),
  `total_hors_reduction` INT,
  `reduction_type` VARCHAR(255),
  `reduction` INT,
  `tva` INT,
  `total` INT,
  `notes` TEXT,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table FactureItems
-- =============================================================
CREATE TABLE `FactureItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `facture_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` INT NOT NULL,
  `tva` INT DEFAULT 0,
  `discount` INT DEFAULT 0,
  `total_item` INT GENERATED ALWAYS AS ((quantity * unit_price * (1 + tva / 100)) - discount) STORED,
  FOREIGN KEY (`facture_id`) REFERENCES `Factures`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- =============================================================
-- Table Sales
-- =============================================================
CREATE TABLE `Sales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity_sold` INT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `total_profit` DECIMAL(22,2) NOT NULL,
  `sale_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Orders
-- =============================================================
CREATE TABLE `Orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `product_id` INT,
  `supplier_id` INT,
  `quantity` INT DEFAULT 0,
  `status` ENUM('pending', 'sent', 'delivered') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATE DEFAULT NULL,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Mouvements de stock
-- =============================================================
CREATE TABLE `Mouvements_stock` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `produit_id` INT NOT NULL,
  `type` ENUM('entrée', 'sortie') NOT NULL,
  `quantity` INT NOT NULL,
  `created_by` INT, -- id de EntrepriseUsers
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`produit_id`) REFERENCES `Product`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `EntrepriseUsers`(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =============================================================
-- Table Settings
-- =============================================================
CREATE TABLE `Settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entreprise_id` INT NOT NULL,
  `stock_alert_threshold` INT NOT NULL DEFAULT 5,
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- =============================================================
-- Table Activity (Journal des actions)
-- =============================================================
CREATE TABLE `Activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entreprise_id` INT NOT NULL,        -- L’entreprise concernée
  `user_id` INT DEFAULT NULL,          -- L’utilisateur qui a fait l’action
  `action` VARCHAR(150) NOT NULL,      -- Type d’action (ex: 'add_product', 'update_invoice')
  `entity_type` VARCHAR(100) DEFAULT NULL, -- Sur quelle table (Product, Factures, etc.)
  `entity_id` INT DEFAULT NULL,        -- ID de l’élément concerné
  `description` TEXT DEFAULT NULL,     -- Description lisible ("Produit Dell ajouté au stock")
  `ip_address` VARCHAR(45) DEFAULT NULL, -- Adresse IP optionnelle
  `user_agent` TEXT DEFAULT NULL,        -- Navigateur / App utilisée
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`entreprise_id`) REFERENCES `Entreprises`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- ============================================================
-- Vues pour simplifier les requêtes courantes
-- ============================================================
-- Vue combinée des utilisateurs (admins SaaS + travailleurs)
CREATE OR REPLACE VIEW all_users AS
SELECT id, email COLLATE utf8mb4_general_ci AS email, password_hash, 'admin' AS type
FROM users
UNION ALL
SELECT id, email COLLATE utf8mb4_general_ci AS email, password_hash, 'worker' AS type
FROM Workers;


COMMIT;
