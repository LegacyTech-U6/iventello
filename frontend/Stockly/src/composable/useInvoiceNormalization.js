/**
 * useInvoiceNormalization.js
 * 
 * Composable pour normaliser les données des factures
 * Résout les incohérences entre unit_price (backend) et selling_price (frontend)
 * Prévient les valeurs NaN dues aux conversions de types incorrectes
 */

/**
 * Obtient le prix unitaire d'un article de facture
 * Essaie selling_price en premier, puis unit_price, sinon 0
 * 
 * @param {Object} item - L'article de facture
 * @returns {number} Le prix unitaire converti en nombre
 */
export const getItemPrice = (item) => {
  if (!item) return 0;
  return Number(item.selling_price || item.unit_price || 0);
};

/**
 * Obtient la quantité d'un article
 * 
 * @param {Object} item - L'article de facture
 * @returns {number} La quantité convertie en nombre
 */
export const getItemQuantity = (item) => {
  if (!item) return 0;
  return Number(item.quantity || 0);
};

/**
 * Obtient la remise d'un article
 * 
 * @param {Object} item - L'article de facture
 * @returns {number} La remise convertie en nombre
 */
export const getItemDiscount = (item) => {
  if (!item) return 0;
  return Number(item.discount || 0);
};

/**
 * Calcule le total d'une ligne: (Price * Qty) - Discount
 * 
 * @param {Object} item - L'article de facture
 * @returns {number} Le total de la ligne
 */
export const calculateItemTotal = (item) => {
  if (!item) return 0;
  const price = getItemPrice(item);
  const qty = getItemQuantity(item);
  const discount = getItemDiscount(item);
  return price * qty - discount;
};

/**
 * Calcule le subtotal d'une liste d'articles
 * Subtotal = Somme de tous les totaux de ligne
 * 
 * @param {Array} items - Liste des articles
 * @returns {number} Le subtotal
 */
export const calculateSubtotal = (items = []) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);
};

/**
 * Normalise les données d'une facture entière
 * Convertit tous les prix en nombres pour éviter les NaN
 * 
 * @param {Object} invoice - L'objet facture
 * @returns {Object} La facture normalisée
 */
export const normalizeInvoice = (invoice) => {
  if (!invoice) return {};
  
  return {
    ...invoice,
    discount: Number(invoice.discount || 0),
    tax: Number(invoice.tax || 0),
    tva: Number(invoice.tva || 0),
    total: Number(invoice.total || 0),
    general_total: Number(invoice.general_total || 0),
    items: Array.isArray(invoice.items) 
      ? invoice.items.map(item => ({
          ...item,
          quantity: getItemQuantity(item),
          selling_price: getItemPrice(item),
          unit_price: getItemPrice(item),
          discount: getItemDiscount(item),
        }))
      : [],
  };
};

/**
 * Composable pour utiliser les fonctions de normalisation
 * 
 * @returns {Object} Les fonctions de normalisation
 */
export const useInvoiceNormalization = () => {
  return {
    getItemPrice,
    getItemQuantity,
    getItemDiscount,
    calculateItemTotal,
    calculateSubtotal,
    normalizeInvoice,
  };
};
