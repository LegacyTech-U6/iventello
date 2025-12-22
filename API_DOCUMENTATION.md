# 🔌 API Documentation - Iventello

Documentation complète de toutes les endpoints de l'API REST.

**Base URL**: `https://stock-management-app-jq0h.onrender.com/api`  
**Local**: `http://localhost:5000/api`

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response 201:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "verified": false
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "token": "eyJhbGc...",
  "user": { ... }
}

Response 401:
{
  "message": "Invalid credentials"
}
```

### Verify Email
```http
POST /auth/verify/{token}

Response 200:
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response 200:
{
  "message": "Logged out successfully"
}
```

---

## 📦 Products

### List Products
```http
GET /products?enterpriseId=1&category=2&page=1&limit=20

Query Parameters:
- enterpriseId (required): ID de l'entreprise
- category (optional): ID de la catégorie
- search (optional): Terme de recherche
- sortBy (optional): name|price|quantity|createdAt
- page (optional): Numéro de page (défaut: 1)
- limit (optional): Articles par page (défaut: 20)

Response 200:
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "sku": "LAPTOP-001",
      "price": 1200.00,
      "quantity": 5,
      "categoryId": 1,
      "description": "High-end laptop",
      "image": "cloudinary-url",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Create Product
```http
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "price": 1200.00,
  "quantity": 5,
  "categoryId": 1,
  "enterpriseId": 1,
  "description": "High-end laptop",
  "image": "file-url"
}

Response 201:
{
  "product": { ... }
}
```

### Get Product Details
```http
GET /products/{id}
Authorization: Bearer {token}

Response 200:
{
  "product": { ... }
}
```

### Update Product
```http
PUT /products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 1300.00,
  "quantity": 10
}

Response 200:
{
  "product": { ... }
}
```

### Delete Product
```http
DELETE /products/{id}
Authorization: Bearer {token}

Response 200:
{
  "message": "Product deleted successfully"
}
```

---

## 👥 Clients

### List Clients
```http
GET /clients?enterpriseId=1&page=1&limit=20

Query Parameters:
- enterpriseId (required)
- search (optional)
- page (optional)
- limit (optional)

Response 200:
{
  "clients": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "123456789",
      "address": "123 Main St",
      "city": "Paris",
      "enterpriseId": 1,
      "totalOrders": 5,
      "totalSpent": 5000.00,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

### Create Client
```http
POST /clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "123456789",
  "address": "123 Main St",
  "city": "Paris",
  "enterpriseId": 1
}

Response 201:
{
  "client": { ... }
}
```

### Update Client
```http
PUT /clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "email": "jane@example.com"
}

Response 200:
{
  "client": { ... }
}
```

### Delete Client
```http
DELETE /clients/{id}
Authorization: Bearer {token}

Response 200:
{
  "message": "Client deleted"
}
```

---

## 📄 Invoices (Factures)

### List Invoices
```http
GET /factures?enterpriseId=1&status=paid&page=1

Query Parameters:
- enterpriseId (required)
- status (optional): all|pending|paid|cancelled
- clientId (optional)
- startDate (optional): YYYY-MM-DD
- endDate (optional): YYYY-MM-DD
- page (optional)
- limit (optional)

Response 200:
{
  "factures": [
    {
      "id": 1,
      "number": "INV-2025-001",
      "clientId": 1,
      "client": { "name": "John Doe" },
      "items": [
        {
          "productId": 1,
          "productName": "Laptop",
          "quantity": 1,
          "unitPrice": 1200.00,
          "total": 1200.00
        }
      ],
      "subtotal": 1200.00,
      "tax": 240.00,
      "total": 1440.00,
      "status": "paid",
      "issueDate": "2025-01-01",
      "dueDate": "2025-02-01",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

### Create Invoice
```http
POST /factures
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientId": 1,
  "enterpriseId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "unitPrice": 1200.00
    },
    {
      "productId": 2,
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "taxRate": 20,
  "notes": "Payment due within 30 days",
  "issueDate": "2025-01-01",
  "dueDate": "2025-02-01"
}

Response 201:
{
  "facture": { ... }
}
```

### Get Invoice Details
```http
GET /factures/{id}
Authorization: Bearer {token}

Response 200:
{
  "facture": { ... }
}
```

### Update Invoice
```http
PUT /factures/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "paid",
  "notes": "Updated notes"
}

Response 200:
{
  "facture": { ... }
}
```

### Export Invoice to PDF
```http
GET /factures/{id}/pdf
Authorization: Bearer {token}

Response 200:
(PDF file)
```

### Delete Invoice
```http
DELETE /factures/{id}
Authorization: Bearer {token}

Response 200:
{
  "message": "Invoice deleted"
}
```

---

## 🛒 Purchase Orders

### List Purchases
```http
GET /purchase?enterpriseId=1&status=pending&page=1

Query Parameters:
- enterpriseId (required)
- supplierId (optional)
- status (optional): pending|received|cancelled
- page (optional)
- limit (optional)

Response 200:
{
  "purchases": [
    {
      "id": 1,
      "number": "PO-2025-001",
      "supplierId": 1,
      "supplier": { "name": "Supplier Name" },
      "items": [
        {
          "productId": 1,
          "productName": "Laptop",
          "quantity": 5,
          "unitPrice": 900.00,
          "total": 4500.00
        }
      ],
      "total": 4500.00,
      "status": "pending",
      "orderDate": "2025-01-01",
      "expectedDate": "2025-01-15",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 20
}
```

### Create Purchase Order
```http
POST /purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplierId": 1,
  "enterpriseId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "unitPrice": 900.00
    }
  ],
  "orderDate": "2025-01-01",
  "expectedDate": "2025-01-15",
  "notes": "Urgent order"
}

Response 201:
{
  "purchase": { ... }
}
```

### Update Purchase Status
```http
PUT /purchase/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "received",
  "receivedDate": "2025-01-10"
}

Response 200:
{
  "purchase": { ... }
}
```

---

## 📊 Statistics & Reports

### Dashboard Stats
```http
GET /stats?enterpriseId=1

Response 200:
{
  "stats": {
    "totalRevenue": 50000.00,
    "totalSales": 150,
    "totalClients": 45,
    "lowStockProducts": 12,
    "outOfStockProducts": 3,
    "averageOrderValue": 333.33,
    "monthlyRevenue": [
      { "month": "Jan", "revenue": 5000 },
      { "month": "Feb", "revenue": 5500 }
    ],
    "topProducts": [
      { "name": "Laptop", "sales": 25 },
      { "name": "Mouse", "sales": 100 }
    ]
  }
}
```

### Sales Reports
```http
GET /stats/reports?enterpriseId=1&type=monthly&startDate=2025-01-01&endDate=2025-12-31

Query Parameters:
- enterpriseId (required)
- type: daily|weekly|monthly|yearly
- startDate (optional)
- endDate (optional)

Response 200:
{
  "report": {
    "type": "monthly",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "data": [
      {
        "period": "2025-01",
        "revenue": 5000.00,
        "orders": 12,
        "clients": 8,
        "topProduct": "Laptop"
      }
    ]
  }
}
```

---

## 🏢 Enterprise

### List Enterprises
```http
GET /entreprise?page=1&limit=20

Response 200:
{
  "enterprises": [
    {
      "id": 1,
      "name": "My Shop",
      "description": "Retail shop",
      "address": "123 Main St",
      "city": "Paris",
      "email": "shop@example.com",
      "phone": "123456789",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}
```

### Create Enterprise
```http
POST /entreprise
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Shop",
  "description": "Retail shop",
  "address": "123 Main St",
  "city": "Paris",
  "email": "shop@example.com",
  "phone": "123456789"
}

Response 201:
{
  "enterprise": { ... }
}
```

### Update Enterprise
```http
PUT /entreprise/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response 200:
{
  "enterprise": { ... }
}
```

---

## 👔 Workers

### List Workers
```http
GET /workers?enterpriseId=1&page=1

Response 200:
{
  "workers": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "position": "Sales Manager",
      "department": "Sales",
      "salary": 3000.00,
      "startDate": "2024-01-01",
      "status": "active"
    }
  ],
  "total": 50
}
```

### Create Worker
```http
POST /workers
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "position": "Sales Manager",
  "department": "Sales",
  "salary": 3000.00,
  "enterpriseId": 1
}

Response 201:
{
  "worker": { ... }
}
```

---

## 🔖 Categories

### List Categories
```http
GET /category?enterpriseId=1

Response 200:
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices",
      "productCount": 45
    }
  ]
}
```

### Create Category
```http
POST /category
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices",
  "enterpriseId": 1
}

Response 201:
{
  "category": { ... }
}
```

---

## 🏭 Suppliers

### List Suppliers
```http
GET /suppliers?enterpriseId=1&page=1

Response 200:
{
  "suppliers": [
    {
      "id": 1,
      "name": "Tech Supplier Inc",
      "email": "contact@techsupplier.com",
      "phone": "987654321",
      "address": "456 Supplier St",
      "city": "Lyon",
      "paymentTerms": "NET 30",
      "rating": 4.5
    }
  ]
}
```

### Create Supplier
```http
POST /suppliers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Supplier Inc",
  "email": "contact@techsupplier.com",
  "phone": "987654321",
  "address": "456 Supplier St",
  "city": "Lyon",
  "enterpriseId": 1
}

Response 201:
{
  "supplier": { ... }
}
```

---

## 👤 Roles & Permissions

### List Roles
```http
GET /roles?enterpriseId=1

Response 200:
{
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Full access",
      "permissions": ["canViewDashboard", "canManageUsers", "canDeleteData"]
    },
    {
      "id": 2,
      "name": "StockManager",
      "description": "Manages stock",
      "permissions": ["canViewDashboard", "canManageStock"]
    },
    {
      "id": 3,
      "name": "SalesPoint",
      "description": "Handles sales",
      "permissions": ["canViewDashboard", "canCreateInvoice"]
    }
  ]
}
```

### Create Role
```http
POST /roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Manager",
  "description": "Store manager",
  "enterpriseId": 1,
  "permissions": ["canViewDashboard", "canManageUsers"]
}

Response 201:
{
  "role": { ... }
}
```

---

## 📋 Activity Log

### Get Activity Log
```http
GET /activity?enterpriseId=1&page=1&limit=50

Query Parameters:
- enterpriseId (required)
- userId (optional)
- action (optional): create|update|delete|login|logout
- page (optional)
- limit (optional)

Response 200:
{
  "activities": [
    {
      "id": 1,
      "userId": 5,
      "user": { "name": "John Doe" },
      "action": "create",
      "entityType": "product",
      "entityId": 1,
      "description": "Created product: Laptop",
      "timestamp": "2025-01-01T10:30:00Z"
    }
  ],
  "total": 500
}
```

---

## 🔔 Notifications

### Get Notifications
```http
GET /notifications?userId={userId}

Response 200:
{
  "notifications": [
    {
      "id": 1,
      "type": "lowStock",
      "title": "Low Stock Alert",
      "message": "Product 'Laptop' is running low",
      "read": false,
      "createdAt": "2025-01-01T10:30:00Z"
    }
  ]
}
```

### Mark as Read
```http
PUT /notifications/{id}/read
Authorization: Bearer {token}

Response 200:
{
  "notification": { ... }
}
```

---

## 🔄 Currency Conversion

### Get Exchange Rates
```http
GET /convert

Response 200:
{
  "rates": {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "XAF": 615.5
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized - Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Error details"
}
```

---

## 📌 Authentication Headers

Toutes les requêtes nécessitent un header Authorization:

```
Authorization: Bearer {jwt_token}
```

Obtenir un token:
```
POST /auth/login
```

---

## 🧪 Testing avec cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?enterpriseId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Product","price":100,"quantity":10,"enterpriseId":1
  }'
```

---

Dernière mise à jour: 22 Novembre 2025
