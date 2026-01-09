// src/types/offline.ts
// Types TypeScript pour l'architecture offline-first

export interface Product {
  id?: number;
  Prod_name: string;
  entreprise_id: number;
  quantity: number;
  selling_price: number;
  cost_price: number;
  Prod_Description?: string;
  code_bar?: string;
  date_of_arrival?: string;
  Prod_image?: string;
  min_stock_level?: number;
  max_stock_level?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Entreprise {
  id?: number;
  uuid?: string;
  name: string;
  currency?: string;
  description?: string;
  logo_url?: string;
  numero_fiscal?: string;
  nui?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  email_contact?: string;
  telephone_contact?: string;
  informations_bancaires?: string;
  created_at?: string;
}

export interface User {
  id?: number;
  username: string;
  Last_name: string;
  email: string;
  telephone: string;
  password_hash: string;
  is_active?: boolean;
  activation_token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id?: number;
  client_name: string;
  client_Signature?: string;
  client_PhoneNumber?: string;
  location?: string;
  email?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Purchase {
  id?: number;
  supplier_name: string;
  payment_method?: string;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  quantity: number;
  unit_cost: number;
  tva?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id?: number;
  quantity?: number;
  status?: 'pending' | 'sent' | 'delivered';
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id?: number;
  date_echeance?: string;
  status?: 'en_attente' | 'payee' | 'annulee' | 'non-livrer';
  payment_method?: string;
  total: number;
  reduction_type?: string;
  discount?: number;
  tax?: number;
  general_total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  id?: number;
  supplier_name: string;
  supplier_address?: string;
  phone_number?: string;
  email?: string;
  whatsapp_number?: string;
  preferred_channel?: 'email' | 'whatsapp' | 'phone';
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id?: number;
  user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  description?: string;
  amount?: number;
  quantity?: number;
  ip_address?: string;
  user_agent?: string;
}

export interface Notification {
  id?: number;
  type: string;
  message: string;
  user_id?: number;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncChange {
  id?: number;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  record_id: number;
  data: Record<string, any>;
  timestamp: number;
  synced?: boolean;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: number;
  progress: number;
  message: string;
  error?: string;
}
