/**
 * @file src/services/offline/LocalStorageService.ts
 * @description Service de stockage local SQLite pour le mode offline
 * Gère la base de données SQLite locale avec synchronisation
 */

/**
 * Service de stockage local - interface générique
 * Peut être implémenté avec SQLite (server) ou sql.js (client PWA)
 */
export interface ILocalStorageProvider {
  /**
   * Initialise la base de données locale
   */
  initialize(): Promise<void>;

  /**
   * Crée ou met à jour une entité
   */
  upsertEntity<T>(
    entityType: string,
    id: number,
    data: T,
    version: number
  ): Promise<T>;

  /**
   * Récupère une entité par ID
   */
  getEntity<T>(entityType: string, id: number): Promise<T | null>;

  /**
   * Récupère toutes les entités d'un type
   */
  getAll<T>(entityType: string, filters?: Record<string, any>): Promise<T[]>;

  /**
   * Supprime une entité
   */
  deleteEntity(entityType: string, id: number): Promise<boolean>;

  /**
   * Récupère les changements non synchronisés
   */
  getChanges(): Promise<Array<{
    entityType: string;
    entityId: number;
    operation: 'create' | 'update' | 'delete';
    data: Record<string, any>;
  }>>;

  /**
   * Marque les changements comme synchronisés
   */
  markSynced(entityType: string, entityId: number): Promise<void>;

  /**
   * Ferme la connexion
   */
  close(): Promise<void>;
}

/**
 * Implémentation SQLite locale
 * À utiliser côté serveur pour tester offline ou côté client PWA
 */
export class SQLiteLocalStorage implements ILocalStorageProvider {
  private db: any; // sqlite3.Database | sql.Database (selon l'environnement)
  private readonly dbName: string;
  private isInitialized: boolean = false;

  constructor(dbName: string = 'stockly_offline.db') {
    this.dbName = dbName;
  }

  /**
   * Initialise la base SQLite locale
   * Crée les tables si nécessaire
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // À implémenter avec le driver approprié:
    // - Client: sql.js
    // - Server Node: sqlite3 ou better-sqlite3

    await this.createTables();
    this.isInitialized = true;

    console.log(`[STORAGE] SQLite local database initialized: ${this.dbName}`);
  }

  /**
   * Crée les tables nécessaires
   */
  private async createTables(): Promise<void> {
    const schema = `
      -- Table de produits locaux
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        entreprise_id INTEGER NOT NULL,
        sku TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        cost_price REAL,
        selling_price REAL,
        quantity_on_hand INTEGER DEFAULT 0,
        min_stock_level INTEGER DEFAULT 0,
        category_id INTEGER,
        is_active BOOLEAN DEFAULT 1,
        version INTEGER DEFAULT 1,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_synced BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Table de factures locales
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY,
        entreprise_id INTEGER NOT NULL,
        invoice_number TEXT NOT NULL UNIQUE,
        client_id INTEGER NOT NULL,
        status TEXT DEFAULT 'draft',
        subtotal REAL DEFAULT 0,
        total REAL DEFAULT 0,
        version INTEGER DEFAULT 1,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_synced BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Table des lignes de facture
      CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        line_total REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Table de suivi des clients locaux
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY,
        entreprise_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        version INTEGER DEFAULT 1,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_synced BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Table de mouvements de stock
      CREATE TABLE IF NOT EXISTS stock_movements (
        id INTEGER PRIMARY KEY,
        entreprise_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_synced BOOLEAN DEFAULT 0
      );

      -- Index pour performance
      CREATE INDEX IF NOT EXISTS idx_products_entreprise ON products(entreprise_id);
      CREATE INDEX IF NOT EXISTS idx_products_synced ON products(is_synced);
      CREATE INDEX IF NOT EXISTS idx_invoices_entreprise ON invoices(entreprise_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_synced ON invoices(is_synced);
      CREATE INDEX IF NOT EXISTS idx_clients_entreprise ON clients(entreprise_id);
      CREATE INDEX IF NOT EXISTS idx_movements_synced ON stock_movements(is_synced);
    `;

    // À exécuter avec le driver approprié
    // this.db.exec(schema);
  }

  /**
   * Insère ou met à jour une entité
   */
  async upsertEntity<T>(
    entityType: string,
    id: number,
    data: T,
    version: number
  ): Promise<T> {
    // À implémenter selon le entityType
    const query = `
      INSERT OR REPLACE INTO ${this.sanitizeTableName(entityType)} 
      (id, ${Object.keys(data).join(', ')}, version, is_synced, updated_at)
      VALUES (?, ${Array(Object.keys(data).length).fill('?').join(', ')}, ?, 0, CURRENT_TIMESTAMP)
    `;

    // À exécuter avec le driver
    console.log(`[STORAGE] Upserted ${entityType}#${id}`);
    return data;
  }

  /**
   * Récupère une entité par ID
   */
  async getEntity<T>(entityType: string, id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.sanitizeTableName(entityType)} WHERE id = ?`;
    
    // À exécuter avec le driver
    console.log(`[STORAGE] Fetching ${entityType}#${id}`);
    return null;
  }

  /**
   * Récupère toutes les entités avec filtres optionnels
   */
  async getAll<T>(
    entityType: string,
    filters?: Record<string, any>
  ): Promise<T[]> {
    let query = `SELECT * FROM ${this.sanitizeTableName(entityType)}`;
    
    if (filters) {
      const whereClause = Object.entries(filters)
        .map(([key]) => `${key} = ?`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
    }

    // À exécuter avec le driver
    console.log(`[STORAGE] Fetching all ${entityType}`);
    return [];
  }

  /**
   * Supprime une entité
   */
  async deleteEntity(entityType: string, id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.sanitizeTableName(entityType)} WHERE id = ?`;
    
    // À exécuter avec le driver
    console.log(`[STORAGE] Deleted ${entityType}#${id}`);
    return true;
  }

  /**
   * Récupère les changements non synchronisés
   */
  async getChanges(): Promise<Array<{
    entityType: string;
    entityId: number;
    operation: 'create' | 'update' | 'delete';
    data: Record<string, any>;
  }>> {
    // Requête pour récupérer tous les enregistrements non synchronisés
    const unsyncedData: any[] = [];

    // Produits
    const unsyncedProducts = await this.getAll('products', { is_synced: 0 });
    unsyncedData.push(...unsyncedProducts.map((p: any) => ({
      entityType: 'product',
      entityId: p.id,
      operation: 'update' as const,
      data: p
    })));

    // Factures
    const unsyncedInvoices = await this.getAll('invoices', { is_synced: 0 });
    unsyncedData.push(...unsyncedInvoices.map((i: any) => ({
      entityType: 'invoice',
      entityId: i.id,
      operation: 'update' as const,
      data: i
    })));

    return unsyncedData;
  }

  /**
   * Marque les changements comme synchronisés
   */
  async markSynced(entityType: string, entityId: number): Promise<void> {
    const query = `
      UPDATE ${this.sanitizeTableName(entityType)} 
      SET is_synced = 1 
      WHERE id = ?
    `;

    // À exécuter avec le driver
    console.log(`[STORAGE] Marked ${entityType}#${entityId} as synced`);
  }

  /**
   * Ferme la connexion
   */
  async close(): Promise<void> {
    if (this.db) {
      // À implémenter selon le driver
      console.log(`[STORAGE] Closed database: ${this.dbName}`);
    }
  }

  /**
   * Utilitaire: nettoie les noms de table
   */
  private sanitizeTableName(name: string): string {
    // Évite les injections SQL
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '');
  }

  /**
   * Récupère des statistiques
   */
  async getStats(): Promise<Record<string, number>> {
    return {
      products: 0,
      invoices: 0,
      unsyncedItems: 0
      // À implémenter
    };
  }
}

export default SQLiteLocalStorage;
