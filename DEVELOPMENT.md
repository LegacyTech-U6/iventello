# 📖 Guide de Développement - Iventello

Ce guide explique comment travailler efficacement sur le projet Iventello.

---

## 🚀 Démarrage rapide

### Terminal 1: Backend
```bash
cd backend
npm install  # une seule fois
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend/Stockly
npm install  # une seule fois
npm run dev
```

**App accessible**: `http://localhost:5173`  
**API**: `http://localhost:5000/api`

---

## 📁 Organisation des fichiers

### Frontend - Ajouter une nouvelle page

**1. Créer la vue** (`src/views/MyNewPage.vue`)
```vue
<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold">Ma nouvelle page</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMyStore } from '@/stores/myStore'

const store = useMyStore()

onMounted(() => {
  store.fetchData()
})
</script>

<style scoped>
/* Styles spécifiques à la page */
</style>
```

**2. Ajouter la route** (`src/router/index.ts`)
```typescript
{
  path: '/my-page',
  name: 'MyNewPage',
  component: () => import('@/views/MyNewPage.vue'),
  meta: { requiresAuth: true }
}
```

**3. Lier le navBar** (`src/components/NavBar.vue`)
```vue
<router-link to="/my-page">Ma page</router-link>
```

### Frontend - Ajouter un composant réutilisable

**1. Créer le composant** (`src/components/MyComponent.vue`)
```vue
<template>
  <div class="component">
    <slot>Contenu par défaut</slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  disabled: false
})

const emit = defineEmits<{
  click: [value: string]
}>()
</script>
```

**2. Utiliser le composant**
```vue
<MyComponent 
  title="Mon titre"
  @click="handleClick"
>
  Slot content
</MyComponent>
```

### Frontend - Créer un store Pinia

**Créer** (`src/stores/myStore.js`)
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/service/api'

export const useMyStore = defineStore('my', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const itemCount = computed(() => items.value.length)
  const activeItems = computed(() => 
    items.value.filter(item => item.active)
  )

  // Actions
  async function fetchItems() {
    loading.value = true
    try {
      const { data } = await api.get('/items')
      items.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createItem(payload) {
    try {
      const { data } = await api.post('/items', payload)
      items.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    // State
    items,
    loading,
    error,
    // Getters
    itemCount,
    activeItems,
    // Actions
    fetchItems,
    createItem
  }
}, {
  persist: true  // Persist to localStorage
})
```

**Utiliser le store**
```vue
<script setup>
import { useMyStore } from '@/stores/myStore'

const store = useMyStore()
// Accès state: store.items
// Appeler action: store.fetchItems()
</script>
```

### Backend - Ajouter une nouvelle route

**1. Créer le modèle** (`src/models/item.model.js`)
```javascript
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    enterpriseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  })

  Item.associate = (models) => {
    Item.belongsTo(models.enterprise, { foreignKey: 'enterpriseId' })
  }

  return Item
}
```

**2. Créer le contrôleur** (`src/controller/item.controller.js`)
```javascript
const db = require('../config/db')
const { validationResult } = require('express-validator')

const Item = db.items

exports.getAllItems = async (req, res) => {
  try {
    const { enterpriseId } = req.query
    
    const items = await Item.findAll({
      where: { enterpriseId }
    })
    
    res.json({ items })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createItem = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, description, price, quantity, enterpriseId } = req.body
    
    const item = await Item.create({
      name,
      description,
      price,
      quantity,
      enterpriseId
    })

    res.status(201).json({ item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, quantity } = req.body
    
    const item = await Item.findByPk(id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    await item.update({
      name,
      description,
      price,
      quantity
    })

    res.json({ item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    
    await Item.destroy({ where: { id } })
    
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

**3. Créer les routes** (`src/routes/item.route.js`)
```javascript
const express = require('express')
const { body } = require('express-validator')
const itemController = require('../controller/item.controller')
const { authenticateToken } = require('../middleware/AuthenticatedUser')
const { authorize } = require('../middleware/Role')

const router = express.Router()

router.use(authenticateToken)

router.get('/', itemController.getAllItems)

router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('enterpriseId').isInt().withMessage('Enterprise ID is required')
  ],
  itemController.createItem
)

router.put('/:id', itemController.updateItem)

router.delete('/:id', authorize('canDeleteItem'), itemController.deleteItem)

module.exports = router
```

**4. Enregistrer la route** (`backend/index.js`)
```javascript
const itemRoutes = require('./src/routes/item.route')

app.use('/api/items', itemRoutes)
```

---

## 💾 Base de données

### Ajouter une colonne

**1. Créer une migration**
```bash
npx sequelize-cli migration:generate --name add_field_to_items
```

**2. Éditer le fichier migration** (`migrations/xxx-add_field_to_items.js`)
```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Items', 'newField', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Items', 'newField')
  }
}
```

**3. Exécuter la migration**
```bash
npx sequelize-cli db:migrate
```

---

## 🧪 Tests

### Écrire un test unitaire (Frontend)

**`src/components/__tests__/MyComponent.spec.ts`**
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test Title' }
    })
    
    expect(wrapper.text()).toContain('Test Title')
  })

  it('emits click event', async () => {
    const wrapper = mount(MyComponent)
    
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

**Exécuter:**
```bash
npm run test:unit
```

### Écrire un test E2E (Frontend)

**`e2e/my-feature.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should navigate to my page', async ({ page }) => {
    await page.click('a[href="/my-page"]')
    await expect(page).toHaveURL('/my-page')
  })

  test('should submit form', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test Item')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Item created')).toBeVisible()
  })
})
```

**Exécuter:**
```bash
npm run test:e2e
```

---

## 📝 Style guide

### TypeScript

```typescript
// ✅ Bon
interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): Promise<User> {
  // ...
}

// ❌ Mauvais
function getUser(id) {
  return new Promise((resolve) => {
    // ...
  })
}
```

### Vue 3 Composition API

```vue
<script setup lang="ts">
// ✅ Utiliser setup syntactic sugar
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/myStore'

interface Props {
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Default'
})

const emit = defineEmits<{
  update: [value: string]
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)

onMounted(() => {
  // ...
})
</script>

<!-- ❌ Éviter l'Options API -->
```

### CSS avec TailwindCSS

```vue
<!-- ✅ Utiliser classes Tailwind -->
<div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 class="text-xl font-bold text-gray-900">Title</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click
  </button>
</div>

<!-- ❌ Éviter CSS inline -->
<div style="display: flex; padding: 16px;">
</div>
```

---

## 🔄 Workflow Git

### Feature workflow

```bash
# 1. Créer une branche feature
git checkout -b feature/add-user-dashboard

# 2. Faire les changements
# ... edit files ...

# 3. Commit avec messages clairs
git add .
git commit -m "feat: Add user dashboard with charts"

# 4. Push
git push origin feature/add-user-dashboard

# 5. Ouvrir une PR sur GitHub
# -> Reviewer approuve
# -> Merge to main

# 6. Local cleanup
git checkout main
git pull
git branch -d feature/add-user-dashboard
```

### Commit messages

```bash
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 🐛 Debugging

### Frontend

**1. Vue DevTools**
- VS Code Extension: `Vue - Official`
- Browser DevTools: Vue tab

**2. Console logging**
```typescript
console.log('Value:', value)
console.table(items)
console.error('Error:', error)
```

**3. Breakpoints**
- DevTools -> Sources -> Set breakpoints
- Press F12 -> Step through code

### Backend

**1. Logging**
```javascript
console.log('Debug:', data)
console.error('Error:', error)
```

**2. Debugging avec VS Code**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 📊 Performance

### Frontend checklist

- [ ] Utiliser `lazy` pour composants lourds
- [ ] Utiliser `computed` pour données dérivées
- [ ] Éviter watchers récursifs
- [ ] Images optimisées (Cloudinary)
- [ ] Code splitting (Vite automatique)

### Backend checklist

- [ ] Utiliser pagination pour listes
- [ ] Indexer colonnes de recherche
- [ ] Cache avec `node-cache`
- [ ] Validate inputs
- [ ] Limit file uploads

---

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Preview
npm run preview

# Deploy (Vercel)
vercel
```

### Backend (Render/Railway)

```bash
# Set NODE_ENV=production

# Ajouter les variables d'env:
# MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST
# JWT_SECRET, MAILJET_API_KEY, CLOUDINARY_*

# Déployer
git push origin main  # Auto-deploy si configuré
```

---

## 📚 Quick Reference

### Axios (HTTP)
```typescript
import api from '@/service/api'

// GET
const { data } = await api.get('/items')

// POST
const { data } = await api.post('/items', { name: 'Item' })

// PUT
const { data } = await api.put('/items/1', { name: 'Updated' })

// DELETE
await api.delete('/items/1')
```

### Pinia (State)
```typescript
const store = useMyStore()

// Read
store.items
store.itemCount

// Update
store.items.push(newItem)
await store.fetchItems()
```

### Router (Navigation)
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/my-page')
router.push({ name: 'MyPage', params: { id: 1 } })
```

### Toast notifications
```typescript
import { useToast } from 'vue-sonner'

const { toast } = useToast()
toast.success('Item created!')
toast.error('Error: ' + error.message)
```

---

## ❓ FAQ

**Q: Pourquoi l'API répond 401?**  
A: Token expiré ou invalide. Vérifier JWT_SECRET et token dans localStorage

**Q: Comment ajouter une permission?**  
A: Ajouter dans rolePermission model, puis vérifier dans middleware Role.js

**Q: L'image ne s'upload pas?**  
A: Vérifier Cloudinary credentials et multer config

**Q: Node version incorrecte?**  
A: Utiliser `nvm use 20` ou installer Node 20.19.0+

---

Bon développement! 🎉
