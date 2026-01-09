// src/service/StocklyOfflineService.ts (amélioré)
// Service d'accès local SQLite pour PWA offline-first
// Utilise sql.js + IndexedDB pour persistance

import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { LocalStorageService } from './LocalStorageService';

export class StocklyOfflineService {
  private db: Database | null = null;
  private SQL: SqlJsStatic | null = null;
  private ready: Promise<void>;
  private localStorage: LocalStorageService;

  constructor(private schemaSql: string) {
    this.localStorage = new LocalStorageService();
    this.ready = this.init();
  }

  // Initialisation : charge ou crée la base
  private async init() {
    this.SQL = await initSqlJs({
      locateFile: (file) => `/${file}`
    });
    
    // Essayer de charger depuis IndexedDB
    const saved = await this.localStorage.loadDatabase();
    if (saved) {
      this.db = new this.SQL.Database(saved);
    } else {
      // Créer une nouvelle base
      this.db = new this.SQL.Database();
      this.db.run(this.schemaSql);
      await this.persistDatabase();
    }
  }

  // Attendre que la base soit prête
  public async waitReady() {
    await this.ready;
  }

  // Persister la base dans IndexedDB
  private async persistDatabase() {
    if (this.db) {
      const data = this.db.export();
      await this.localStorage.saveDatabase(data);
    }
  }

  // ============ CRUD Génériques ============

  public async insert<T = any>(table: string, data: Record<string, any>): Promise<number> {
    await this.waitReady();
    const keys = Object.keys(data);
    const values = keys.map(k => data[k]);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    
    this.db!.run(sql, values);
    await this.persistDatabase();
    
    // Récupérer l'ID généré
    const result = this.db!.exec(`SELECT last_insert_rowid() as id`);
    return result[0]?.values[0]?.[0] as number || 0;
  }

  public async update(table: string, data: Record<string, any>, where: string, params: any[] = []) {
    await this.waitReady();
    const keys = Object.keys(data);
    const set = keys.map(k => `${k}=?`).join(',');
    const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
    
    this.db!.run(sql, [...keys.map(k => data[k]), ...params]);
    await this.persistDatabase();
  }

  public async delete(table: string, where: string, params: any[] = []) {
    await this.waitReady();
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    this.db!.run(sql, params);
    await this.persistDatabase();
  }

  public async select<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    await this.waitReady();
    const stmt = this.db!.prepare(sql);
    const rows: T[] = [];
    
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as T);
    }
    stmt.free();
    
    return rows;
  }

  public async selectOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const rows = await this.select<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  // ============ Transactions ============

  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.waitReady();
    try {
      this.db!.run('BEGIN TRANSACTION');
      const result = await callback();
      this.db!.run('COMMIT');
      await this.persistDatabase();
      return result;
    } catch (error) {
      this.db!.run('ROLLBACK');
      throw error;
    }
  }

  // ============ Export/Import ============

  public async export(): Promise<Uint8Array> {
    await this.waitReady();
    return this.db!.export();
  }

  public async import(data: Uint8Array) {
    await this.waitReady();
    this.db!.close();
    this.db = new this.SQL!.Database(data);
    await this.persistDatabase();
  }

  // ============ Reset ============

  public async reset() {
    await this.waitReady();
    if (this.db) {
      this.db.close();
    }
    this.db = new this.SQL!.Database();
    this.db.run(this.schemaSql);
    await this.persistDatabase();
  }

  // ============ Utilitaires ============

  // Compter les enregistrements
  public async count(table: string, where: string = '1=1', params: any[] = []): Promise<number> {
    const result = await this.selectOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${table} WHERE ${where}`,
      params
    );
    return result?.count || 0;
  }

  // Obtenir un enregistrement par ID
  public async findById<T = any>(table: string, id: number): Promise<T | null> {
    return this.selectOne<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  }

  // Obtenir tous les enregistrements
  public async findAll<T = any>(table: string, where: string = '1=1', params: any[] = []): Promise<T[]> {
    return this.select<T>(`SELECT * FROM ${table} WHERE ${where}`, params);
  }

  // Batch insert
  public async insertMany(table: string, records: Record<string, any>[]): Promise<void> {
    await this.transaction(async () => {
      for (const record of records) {
        await this.insert(table, record);
      }
    });
  }
}
