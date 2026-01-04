/**
 * @file src/types/index.ts
 * @description Types et interfaces centralisées pour toute l'application
 * Structure cohérente et fortement typée pour la scalabilité
 */

// ============================================================
// ENUMS
// ============================================================

/** Rôles des utilisateurs au niveau entreprise */
export enum UserRole {
  ADMIN_SAAS = 'admin_saas',
  ENTREPRISE_ADMIN = 'entreprise_admin',
  STOCK_MANAGER = 'gestionnaire_stock',
  CASHIER = 'caissier',
  ACCOUNTANT = 'comptable',
  VIEWER = 'viewer'
}

/** Statuts des factures */
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

/** Statuts des commandes d'achat */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SENT = 'sent',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

/** Méthodes de paiement */
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  MOBILE_MONEY = 'mobile_money'
}

/** Préférences de contact */
export enum ContactPreference {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  PHONE = 'phone',
  SMS = 'sms'
}

/** Types de mouvements de stock */
export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  RETURN = 'return',
  LOSS = 'loss'
}

/** Statuts de synchronisation offline */
export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  CONFLICT = 'conflict',
  FAILED = 'failed'
}

/** Statuts des workers */
export enum WorkerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated'
}

/** Statuts des entreprises */
export enum EntrepriseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// ============================================================
// USER & AUTH TYPES
// ============================================================

/** Utilisateur SaaS (base) */
export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Utilisateur avec mot de passe (non exposé publiquement) */
export interface IUserWithPassword extends IUser {
  passwordHash: string;
}

/** Contexte utilisateur extrait du JWT */
export interface IUserContext {
  userId: number;
  email: string;
  role: UserRole;
  entrepriseId: number;
  permissions: string[];
}

/** Payload JWT */
export interface IJWTPayload {
  userId: number;
  email: string;
  entrepriseId: number;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================
// ENTREPRISE & ORGANIZATION
// ============================================================

/** Entreprise/Client SaaS */
export interface IEntreprise {
  id: number;
  uuid: string;
  ownerId: number;
  name: string;
  description?: string;
  logoUrl?: string;
  taxId?: string;
  businessRegistrationId?: string;
  nui?: string;
  email: string;
  phone?: string;
  website?: string;
  currencyCode: string;
  taxRate: number;
  status: EntrepriseStatus;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Utilisateur au sein d'une entreprise */
export interface IEntrepriseUser {
  id: number;
  entrepriseId: number;
  userId: number;
  roleId: number;
  isActive: boolean;
  additionalPermissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Rôle */
export interface IRole {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
}

/** Permission */
export interface IPermission {
  id: number;
  name: string;
  description?: string;
  resource: string;  // 'products', 'invoices', etc.
  action: string;    // 'create', 'read', 'update', 'delete'
  createdAt: Date;
}

// ============================================================
// EMPLOYEE / WORKER
// ============================================================

/** Worker/Employé */
export interface IWorker {
  id: number;
  entrepriseId: number;
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  dateHired?: Date;
  dateEnded?: Date;
  phone?: string;
  status: WorkerStatus;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// ============================================================
// CATALOG TYPES
// ============================================================

/** Catégorie de produits */
export interface ICategory {
  id: number;
  entrepriseId: number;
  name: string;
  description?: string;
  parentCategoryId?: number;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Fournisseur */
export interface ISupplier {
  id: number;
  entrepriseId: number;
  name: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  preferredContactMethod: ContactPreference;
  paymentTerms?: string;
  deliveryTimeDays?: number;
  minimumOrderQuantity?: number;
  isActive: boolean;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Client */
export interface IClient {
  id: number;
  entrepriseId: number;
  name: string;
  type: 'individual' | 'company';
  email?: string;
  phone?: string;
  website?: string;
  companyRegistrationId?: string;
  taxId?: string;
  preferredContactMethod: ContactPreference;
  creditLimit?: number;
  creditUsed: number;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// ============================================================
// PRODUCT TYPES
// ============================================================

/** Produit/Article */
export interface IProduct {
  id: number;
  entrepriseId: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId?: number;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  taxRate: number;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  minStockLevel: number;
  maxStockLevel?: number;
  reorderQuantity?: number;
  primarySupplierId?: number;
  imageUrl?: string;
  dateOfArrival?: Date;
  dateOfExpiry?: Date;
  isActive: boolean;
  isDiscontinued: boolean;
  unitOfMeasure: string;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Mouvement de stock */
export interface IStockMovement {
  id: number;
  entrepriseId: number;
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  warehouseLocation?: string;
  createdAt: Date;
  createdBy?: number;
}

// ============================================================
// ORDER & PURCHASE TYPES
// ============================================================

/** Commande d'achat */
export interface IPurchaseOrder {
  id: number;
  entrepriseId: number;
  supplierId: number;
  poNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Ligne de commande d'achat */
export interface IPurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// INVOICE & SALES TYPES
// ============================================================

/** Facture/Invoice */
export interface IInvoice {
  id: number;
  entrepriseId: number;
  clientId: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  status: InvoiceStatus;
  subtotal: number;
  discountType: 'none' | 'percentage' | 'fixed';
  discountValue: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/** Ligne de facture */
export interface IInvoiceItem {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountAmount: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Enregistrement de vente */
export interface ISale {
  id: number;
  entrepriseId: number;
  invoiceId?: number;
  productId: number;
  quantitySold: number;
  unitPrice: number;
  costPrice: number;
  totalPrice: number;
  totalCost: number;
  profit: number;
  marginPercentage: number;
  saleDate: Date;
  createdAt: Date;
}

/** Paiement */
export interface IPayment {
  id: number;
  entrepriseId: number;
  invoiceId?: number;
  purchaseOrderId?: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  referenceNumber?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
}

// ============================================================
// NOTIFICATION & ACTIVITY TYPES
// ============================================================

/** Notification */
export interface INotification {
  id: number;
  entrepriseId: number;
  userId?: number;
  type: string;  // 'low_stock', 'invoice_due', 'order_arrived', etc.
  title: string;
  message?: string;
  isRead: boolean;
  isArchived: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt: Date;
}

/** Activity Log */
export interface IActivityLog {
  id: number;
  entrepriseId: number;
  userId?: number;
  action: string;        // 'create', 'update', 'delete', 'view'
  entityType: string;    // 'product', 'invoice', 'client', etc.
  entityId?: number;
  changes?: Record<string, any>;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================================
// SYNC & OFFLINE TYPES
// ============================================================

/** Queue de synchronisation */
export interface ISyncQueueItem {
  id: number;
  entrepriseId: number;
  entityType: string;
  entityId: number;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  oldData?: Record<string, any>;
  syncStatus: SyncStatus;
  syncError?: string;
  localVersion?: number;
  serverVersion?: number;
  createdAt: Date;
  syncedAt?: Date;
}

/** Metadata de sync */
export interface ISyncMetadata {
  id?: string;
  entityType: string;
  entityId: number;
  localVersion: number;
  serverVersion: number;
  lastModified: Date;
  status: SyncStatus;
  conflictResolution?: 'keep_local' | 'keep_server' | 'merge';
}

/** Version d'entité (pour audit trail) */
export interface IEntityVersion {
  id: number;
  entityType: string;
  entityId: number;
  version: number;
  data: Record<string, any>;
  changedBy?: number;
  createdAt: Date;
}

// ============================================================
// REQUEST/RESPONSE TYPES
// ============================================================

/** Réponse API standard */
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

/** Réponse pagination */
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Query parameters de pagination */
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// ============================================================
// DTO (Data Transfer Objects)
// ============================================================

/** DTO: Créer un produit */
export interface ICreateProductDTO {
  name: string;
  sku: string;
  categoryId?: number;
  costPrice: number;
  sellingPrice: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  description?: string;
  barcode?: string;
  imageUrl?: string;
  primarySupplierId?: number;
}

/** DTO: Créer une facture */
export interface ICreateInvoiceDTO {
  clientId: number;
  invoiceDate: Date;
  dueDate?: Date;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
  }>;
  discountValue?: number;
  discountType?: 'none' | 'percentage' | 'fixed';
  notes?: string;
}

/** DTO: Créer un client */
export interface ICreateClientDTO {
  name: string;
  type: 'individual' | 'company';
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  creditLimit?: number;
}

// ============================================================
// SETTINGS & CONFIG
// ============================================================

/** Paramètres d'une entreprise */
export interface ISettings {
  id: number;
  entrepriseId: number;
  lowStockThreshold: number;
  autoReorder: boolean;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  poPrefix: string;
  nextPoNumber: number;
  sendInvoiceOnCreate: boolean;
  sendPaymentReminders: boolean;
  data?: Record<string, any>;
}

// ============================================================
// DATABASE MODELS (Pour Sequelize)
// ============================================================

/** Model User (Sequelize) */
export interface UserModel extends IUser {
  readonly passwordHash: string;
}

/** Model Product (Sequelize) */
export interface ProductModel extends IProduct {
  readonly category?: CategoryModel;
  readonly supplier?: SupplierModel;
}

/** Model Invoice (Sequelize) */
export interface InvoiceModel extends IInvoice {
  readonly client: ClientModel;
  readonly items: InvoiceItemModel[];
}

/** Autres models */
export type CategoryModel = ICategory;
export type ClientModel = IClient;
export type SupplierModel = ISupplier;
export type InvoiceItemModel = IInvoiceItem;
export type EntrepriseModel = IEntreprise;
export type WorkerModel = IWorker;
