import API from '../api/axios'
// const API_BASE_URL = "http://localhost:5000/api";
export async function CreateClient(clientData) {
  console.log('🚀 API: Creating client with data:', clientData)

  const formData = new FormData()

  // Add all product fields (except image)
  for (const key in clientData) {
    if (key !== 'image' && clientData[key] !== null && clientData[key] !== undefined) {
      formData.append(key, clientData[key])
      console.log(`📝 Added ${key}:`, clientData[key])
    }
  }

  // Add image (if present)
  if (clientData.image instanceof File) {
    formData.append('image', clientData.image)
  } else if (clientData.image) {
    formData.append('image', clientData.image)
  }

  // Log FormData contents for debugging
  for (let pair of formData.entries()) {
    console.log(`📦 FormData: ${pair[0]} = ${pair[1]}`)
  }

  try {
    const { data } = await API.post('/client', formData)
    console.log('✅ API: Product created successfully:', data)
    return data
  } catch (error) {
    console.error('❌ API: Error creating product:', error)
    if (error.response) {
      console.error('📋 API: Error response data:', error.response.data)
      console.error('🔧 API: Error response status:', error.response.status)
    }
    throw error
  }
}
export async function getClient() {
  const { data } = await API.get('/client')
  return data
}

export async function getClientById(id) {
  const { data } = await API.get(`/client/${id}`)
  return data
}

// ✅ Clients : Mettre à jour un client
export async function updateClient(clientId, clientData) {
  const { data } = await API.put(`/client/${clientId}`, clientData)
  return data
}
// ✅ Clients : Supprimer un client
export async function deleteClient(clientId) {
  const { data } = await API.delete(`/client/${clientId}`)
  return data
}
///////////////////////////////////
//Product Management
//////////////////////////////////
export async function getProduct() {
  const { data } = await API.get('/products')
  return data
}

export async function getOneProduct(id) {
  const { data } = await API.get(`/products/${id}`)
  console.log(data)
  return data
}

export async function updateProduct(productId, productData) {
  const { data } = await API.put(`/products/${productId}`, productData)
  return data
}

export async function deleteProduct(productId) {
  const { data } = await API.delete(`/products/${productId}`)
  return data
}

export async function createProduct(productData) {
  console.log('🚀 API: Creating product with data:', productData)

  const formData = new FormData()

  // Add all product fields (except image)
  for (const key in productData) {
    if (key !== 'Prod_image' && productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key])
      console.log(`📝 Added ${key}:`, productData[key])
    }
  }

  // Add image (if present)
  if (productData.Prod_image instanceof File) {
    formData.append('Prod_image', productData.Prod_image)
    console.log('🖼️ Added image file:', productData.Prod_image.name)
  } else if (productData.Prod_image) {
    formData.append('Prod_image', productData.Prod_image)
    console.log('🖼️ Added image URL/string:', productData.Prod_image)
  }

  // Log FormData contents for debugging
  for (let pair of formData.entries()) {
    console.log(`📦 FormData: ${pair[0]} = ${pair[1]}`)
  }

  try {
    const { data } = await API.post('/products', formData)
    console.log('✅ API: Product created successfully:', data)
    return data
  } catch (error) {
    console.error('❌ API: Error creating product:', error)
    if (error.response) {
      console.error('📋 API: Error response data:', error.response.data)
      console.error('🔧 API: Error response status:', error.response.status)
    }
    throw error
  }
}

export async function OutOfStock() {
  const { data } = await API.get('/products/out-of-stock')
  return data
}

export async function LowStock() {
  const { data } = await API.get('/products/low-stock')
  return data
}

export async function addProductStock(productId, quantityAdd) {
  const { data } = await API.post('/products/add', { productId, quantityAdd })
  return data
}

///////////////////////////////////////
// Invoice calls
///////////////////////////////////////

// ✅ Factures : Créer une facture
export async function createInvoice(invoiceData) {
  const { data } = await API.post('/factures', invoiceData)
  return data
}

// ✅ Factures : Récupérer toutes les factures
// Dans votre service API
export async function getAllInvoices() {
  const { data } = await API.get('/factures')
  console.log('📄 API Response structure:', data) // ✅ Voir la structure
  return data
}

// ✅ Factures : Récupérer une facture par ID avec ses lignes
export async function getInvoiceById(id) {
  const { data } = await API.get(`/factures/${id}`)
  return data
}
///////////////////////////////////////
// Sales calls
///////////////////////////////////////

// ✅ Ventes : Récupérer toutes les ventes
export async function getAllSales() {
  const { data } = await API.get('/sales')
  return data
}

// ✅ Ventes : Récupérer une vente par ID
export async function getSaleById(id) {
  const { data } = await API.get(`/sales/${id}`)
  return data
}
// ✅ Ventes : Créer une vente
export async function createSale(saleData) {
  const { data } = await API.post('/sales', saleData)
  return data
}
// ✅ Ventes : Supprimer une vente
export async function deleteSale(saleId) {
  const { data } = await API.delete(`/sales/${saleId}`)
  return data
}

/////////////////////////////////////
// category management
//////////////////////////////////////

//getting all categories
export async function getCategory() {
  const { data } = await API.get('/category')
  return data
}
// getting a paticular category
export async function getOneCategory(CategoryId) {
  const { data } = await API.get(`/category/${CategoryId}`)
  return data
}

// creating a category
export async function createCategory(categoryData) {
  const { data } = await API.post('/category', categoryData)
  return data
}

//updating category

export async function updateCategory(CategoryId, categoryData) {
  const { data } = await API.put(`/category/${CategoryId}`, categoryData)
  return data
}

//deleting a category

export async function deleteCategory(CategoryId) {
  const { data } = await API.delete(`/category/${CategoryId}`)
  return data
}
//getting products by category

export async function getProductsByCategory(categoryId) {
  const { data } = await API.get(`products/category/${categoryId}`)
  return data
}

/////////////////////////////////////////////////
//supplier  management
/////////////////////////////////////////////////

// creation of supplies
export async function createSupplier(supplierData) {
  const { data } = await API.post(`/suppliers`, supplierData)
  return data
}

/// getting all suppliers
export async function getSuppliers() {
  const { data } = await API.get('/suppliers')
  return data
}

export async function getOneSupplier(supplierId) {
  const { data } = await API.get(`/suppliers/${supplierId}`)
  return data
}

export async function updateSupplier(supplierId, supplierData) {
  const { data } = await API.put(`/suppliers/${supplierId}`, supplierData)
  return data
}

export async function deleteSupplier(supplierId) {
  const { data } = await API.delete(`/suppliers/${supplierId}`)
  return data
}

///////////////////////////////////////
// Entreprise Management
///////////////////////////////////////

// ✅ Créer une entreprise
export async function createEntreprise(entrepriseData) {
   console.log(API)
  console.log('🚀 API: Creating entreprise with data:', entrepriseData)

  const formData = new FormData()

  // Add all product fields (except image)
  for (const key in entrepriseData) {
    if (key !== 'logo_url' && entrepriseData[key] !== null && entrepriseData[key] !== undefined) {
      formData.append(key, entrepriseData[key])
    }
  }

  // Add image (if present)
  if (entrepriseData.logo_url instanceof File) {
    formData.append('logo_url', entrepriseData.logo_url)
  } else if (entrepriseData.logo_url) {
    formData.append('logo_url', entrepriseData.logo_url)
  }

  // Log FormData contents for debugging
  for (let pair of formData.entries()) {
    console.log(`📦 FormData: ${pair[0]} = ${pair[1]}`)
  }

  try {
    const { data } = await API.post('/entreprises', formData)
    console.log('✅ API: Product created successfully:', data)
    return data
  } catch (error) {
    console.error('❌ API: Error creating product:', error)
    if (error.response) {
      console.error('📋 API: Error response data:', error.response.data)
      console.error('🔧 API: Error response status:', error.response.status)
    }
    throw error
  }
}

// ✅ Récupérer toutes les entreprises de l'utilisateur connecté
export async function getEntreprises() {
 
  const { data } = await API.get('/entreprises')
  return data
}

// ✅ Récupérer une entreprise par UUID
export async function getEntrepriseById(uuid) {
  const { data } = await API.get(`/entreprises/${uuid}`)
  return data
}

// ✅ Mettre à jour une entreprise par UUID
export async function updateEntreprise(uuid, entrepriseData) {
  const { data } = await API.put(`/entreprises/${uuid}`, entrepriseData)
  return data
}

// ✅ Supprimer une entreprise par UUID
export async function deleteEntreprise(uuid) {
  const { data } = await API.delete(`/entreprises/${uuid}`)
  return data
}

/////////////////////////////////////////////////////////
// Worker management
/////////////////////////////////////////////////////////

// 🔹 Récupérer tous les workers
export async function getAllWorkers() {
  const { data } = await API.get('/workers')
  return data
}

// 🔹 Récupérer un worker par ID
export async function getWorkerById(id) {
  const { data } = await API.get(`/workers/${id}`)
  return data
}

// 🔹 Créer un nouveau worker
export async function createWorker(workerData) {
  // workerData = { email, password, position, entreprise_id, roles: [] }
  const { data } = await API.post('/workers', workerData)
  return data
}

// 🔹 Mettre à jour un worker
export async function updateWorker(id, updatedData) {
  const { data } = await API.put(`/workers/${id}`, updatedData)
  return data
}

// 🔹 Supprimer un worker
export async function deleteWorker(id) {
  const { data } = await API.delete(`/workers/${id}`)
  return data
}

////////////////////////////////////////////////////////////
// Role management
///////////////////////////////////////////////////////////////
// ✅ Récupérer tous les rôles
export async function getAllRoles() {
  const { data } = await API.get('/roles')
  return data
}

// ✅ Récupérer un rôle par ID
export async function getRoleById(id) {
  const { data } = await API.get(`/roles/${id}`)
  return data
}

// ✅ Créer un nouveau rôle
export async function createRole(roleData) {
  const { data } = await API.post('/roles', roleData)
  return data
}

// ✅ Mettre à jour un rôle
export async function updateRole(id, roleData) {
  const { data } = await API.put(`/roles/${id}`, roleData)
  return data
}

// ✅ Supprimer un rôle
export async function deleteRole(id) {
  const { data } = await API.delete(`/roles/${id}`)
  return data
}

////////////////////////////////////////////////////////////
// Statistics / Analytics API
///////////////////////////////////////////////////////////////

// ✅ Récupérer le total des ventes par produit (global) with period
export async function getProductSales(period) {
  const { data } = await API.get('/stats/sales', {
    params: { period }, // send period as query parameter
  })
  return data
}

// ✅ Récupérer le rapport des ventes pour une période donnée
// period = "day" | "week" | "month"
export async function getSalesReport(period = 'month') {
  const { data } = await API.get('/stats/sales-report', { params: { period } })
  return data
}

// ✅ Récupérer le meilleur produit vendu pour une période
export async function getBestSellingProduct(period = 'month') {
  const { data } = await API.get('/stats/products', { params: { period } })
  return data
}

// ✅ Récupérer la meilleure catégorie globale pour une période
export async function getBestCategory(period = 'month') {
  const { data } = await API.get('/stats/best-category', { params: { period } })
  return data
}

// ✅ Récupérer les meilleurs produits par catégorie
export async function getBestByCategory(period = 'month') {
  const { data } = await API.get(`/stats/revenue-by-category`, { params: { period } })
  return data
}

// recuperer l'evolution des clients
export async function getClientsTats(period = 'month') {
  const { data } = await API.get(`/stats/clients`, { params: { period } })
  return data
}

// ✅ Récupérer le chiffre d'affaires pour une période
// period = "day" | "month" | "year"
export async function getRevenue(period = 'month') {
  const { data } = await API.get('/stats/revenue', { params: { period } })
  return data
}

// ✅ Récupérer le profit pour une période
// period = "day" | "month"
export async function getProfit(period = 'month') {
  const { data } = await API.get('/stats/profit', { params: { period } })
  return data
}

// ✅ Comparer les ventes actuelles vs période précédente
// period = "day" | "month"
export async function compareSales(period = 'month') {
  const { data } = await API.get('/stats/compare-sales', { params: { period } })
  return data
}

// ✅ Récupérer les ventes par trimestre pour analyse saisonnière
export async function getQuarterlySales(period = 'year') {
  const { data } = await API.get('/stats/quarterly-sales', { params: { period } })
  return data
}

// ✅ Récupérer la tendance des ventes pour graphique
// period = "month" | "year"
export async function getSalesTrend(period = 'month') {
  const { data } = await API.get('/stats/sales-trend', { params: { period } })
  return data
}

// ✅ Récupérer la tendance des revenus par catégorie
// period = "month" | "year"
export async function getRevenueByCategory(period = 'month') {
  const { data } = await API.get('/stats/revenue-by-category', { params: { period } })
  return data
}

export async function getProductDistributionByCategory() {
  const response = await API.get('/stats/products/distribution-by-category')
  return response.data
}

//////////////////////////////////////////////////
// Activity logger
/////////////////////////////////////////////////

export async function getAllActivities() {
  const response = await API.get('/activities')
  return response.data
}
////////////////////////////////////////////////////
// Reports: Sales and Purchase
////////////////////////////////////////////////////

// ✅ voir le rapport des ventes journalières
export async function getDailySalesReport() {
  const { data } = await API.get('/activities/reports/daily-sales')
  return data
}

// ✅ Générer le rapport des achats journaliers
export async function getDailyPurchaseReport() {
  const { data } = await API.get('/activities/reports/daily-purchases')
  return data
}

// ✅ generer le raport des ventejounalier

export async function getSellingReport() {
  const { data } = await API.get('/activities/reports/sales-report')
  return data
}

// ===============================
// 🔹 Notifications
// ===============================

// ✅ Récupérer les dernières notifications (5 dernières)
export async function getNotifications() {
  const { data } = await API.get('/notifications') // route GET /api/notifications
  console.log('🔔 Notifications API Response:', data)
  return data
}

// ✅ Marquer une notification comme lue
export async function markNotificationAsRead(notificationId) {
  const { data } = await API.patch(`/notifications/${notificationId}/read`) // route PATCH /api/notifications/:id/read
  console.log(`🔔 Notification ${notificationId} marked as read:`, data)
  return data
}
