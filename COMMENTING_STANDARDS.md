# 📖 Standards de Commentaires - Vue Components

## 🎯 Objectif
Établir des standards cohérents de commentaires pour tous les fichiers Vue, en particulier dans les sections `<script setup>`.

---

## 📋 Structure Générale d'un Composant Commenté

```vue
<!-- 
  NomFichier.vue
  ===============
  Description courte du rôle du composant
  - Point clé 1
  - Point clé 2
  - Point clé 3
-->

<template>
  <!-- Commentaires de section: 1 ligne avant chaque bloc important -->
  <div>
    <!-- Commentaire inline pour code complexe: explique le POURQUOI -->
    <component />
  </div>
</template>

<script setup>
/**
 * NomFichier.vue - Script Setup
 * 
 * Description détaillée du composant
 * - Ce qu'il fait
 * - Quand l'utiliser
 * - Cas d'usage
 */

// ========================================
// SECTION NAME
// ========================================
// Contenu...
</script>
```

---

## 📝 Sections du Script Setup (Ordre Recommandé)

### 1️⃣ Bloc JSDoc Initial
```javascript
/**
 * NomFichier.vue - Script Setup
 * 
 * Description générale du composant
 * (Peut utiliser plusieurs lignes)
 * 
 * Responsabilités:
 * - Res 1
 * - Res 2
 */
```

**Quand l'utiliser**: TOUJOURS au début du script
**Longueur**: 3-5 lignes
**Détails**: Explique le POURQUOI du composant

---

### 2️⃣ Imports
```javascript
// ========================================
// IMPORTS
// ========================================

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// ...
```

**Format**: Grouper par catégorie (Vue, Router, Stores, Composables, API)
**Commentaire**: Optionnel si l'import est auto-explicite

---

### 3️⃣ Composables et Stores
```javascript
// ========================================
// COMPOSABLES ET STORES
// ========================================

/** Composable pour afficher les notifications */
const { showSuccess, showError } = useActionMessage()

/** Store pour la gestion des produits */
const productStore = useProductStore()

/** Router Vue pour la navigation */
const router = useRouter()
```

**Format**: 
- Chaque composable/store sur une ligne
- Commentaire court avec `/** */`

**À inclure**: Description du rôle, pas juste le nom

---

### 4️⃣ Données Réactives (ref)
```javascript
// ========================================
// DONNÉES RÉACTIVES
// ========================================

/** Terme de recherche saisi par l'utilisateur */
const searchQuery = ref('')

/** Liste des produits chargés depuis l'API */
const products = ref([])

/** 
 * Mode d'affichage: 'list' ou 'grid'
 * Controlé par les boutons de vue
 */
const viewMode = ref('list')

/** État du chargement des données (true = en cours) */
const isLoading = ref(false)
```

**Format**: 
- Commentaire JSDoc court pour chaque ref
- Explication de la valeur par défaut
- Mentionner le type si pas évident

**À inclure**: Quand et pourquoi cette donnée change

---

### 5️⃣ Lifecycle Hooks
```javascript
// ========================================
// LIFECYCLE HOOKS
// ========================================

/**
 * Hook du cycle de vie: Exécuté au montage du composant
 * 
 * Actions:
 * 1. Charge les données initiales
 * 2. Configure les listeners
 * 3. Initialise les paramètres
 */
onMounted(async () => {
  isLoading.value = true
  
  // Récupère les produits depuis l'API
  await productStore.fetchProducts()
  
  isLoading.value = false
})

/**
 * Hook du cycle de vie: Exécuté avant la destruction
 * 
 * Actions:
 * - Nettoie les event listeners
 * - Annule les requêtes en cours
 */
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

**Format**: 
- Bloc JSDoc avec description
- Numéroter les actions
- Expliquer POURQUOI chaque action

---

### 6️⃣ Propriétés Calculées (computed)
```javascript
// ========================================
// PROPRIÉTÉS CALCULÉES (COMPUTED)
// ========================================

/**
 * Filtre les produits selon le terme de recherche
 * 
 * Applique un filtre case-insensitive sur:
 * - Nom du produit
 * - Code-barres
 * 
 * @returns {Array} Produits correspondant à la recherche
 * 
 * Exemple:
 * - Input: searchQuery = "iphone"
 * - Output: [{id: 1, name: "iPhone 14", ...}]
 */
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(
    (p) => p.name.toLowerCase().includes(query) ||
           p.barcode.toLowerCase().includes(query)
  )
})

/**
 * Compte le nombre total de produits
 * Utilisé pour afficher les statistiques
 * 
 * @returns {number} Nombre de produits
 */
const totalCount = computed(() => products.value.length)
```

**Format**: 
- JSDoc complet avec description
- Inclure @returns
- Fournir exemples pour logique complexe
- Expliquer l'utilisation du computed

---

### 7️⃣ Méthodes
```javascript
// ========================================
// MÉTHODES
// ========================================

/**
 * Augmente la quantité du produit sélectionné
 * 
 * Appelé par le bouton "+" de l'interface
 * Limite: ne peut pas dépasser le stock disponible
 * 
 * @param {Object} product - Le produit à augmenter
 * @throws {Error} Si le produit n'existe pas
 */
const handleIncrement = (product) => {
  if (!product) throw new Error('Product required')
  if (product.quantity < product.maxStock) {
    product.quantity++
  }
}

/**
 * Navigue vers la page de détail d'un produit
 * 
 * Utilise le router Vue pour la navigation SPA
 * 
 * @param {string} productId - L'ID du produit
 */
const handleViewProduct = (productId) => {
  router.push({
    name: 'product-detail',
    params: { id: productId }
  })
}

/**
 * Récupère les produits depuis l'API
 * 
 * Actions:
 * 1. Affiche l'indicateur de chargement
 * 2. Appelle l'API productStore.fetchProducts()
 * 3. Gère les erreurs de connexion
 * 4. Masque l'indicateur de chargement
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si l'API échoue
 */
const loadProducts = async () => {
  isLoading.value = true
  try {
    await productStore.fetchProducts()
  } catch (error) {
    showError('Erreur lors du chargement des produits')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
```

**Format**: 
- JSDoc complet avec @param, @returns, @throws
- Description claire de l'action
- Mentionner les limitations
- Expliquer les étapes pour méthodes complexes
- Indiquer si async avec @async

---

## 🔗 Template: Commentaires

### Commentaires de Section
```html
<!-- En-tête avec titre et actions -->
<div class="header">
  <!-- Titre -->
  <h1>{{ title }}</h1>
  
  <!-- Boutons d'action -->
  <div class="actions">
    <!-- Bouton créer -->
    <button @click="handleCreate">Créer</button>
  </div>
</div>
```

**Format**: 
- Commentaire avant chaque bloc important
- Format: `<!-- Description -->`
- Même indentation que le code

### Commentaires Inline
```html
<!-- Affiche le modal seulement si showModal est true -->
<div v-if="showModal" class="modal">
  <!-- Barre de fermeture avec croix X -->
  <button @click="showModal = false">✕</button>
  
  <!-- Formulaire pour créer un produit -->
  <form @submit.prevent="handleCreate">
    <!-- Champ: Nom du produit (obligatoire) -->
    <input v-model="form.name" required />
  </form>
</div>
```

**Quand l'utiliser**: Code complexe ou non auto-explicite

---

## 🎨 Styles: Commentaires de Classe

```scss
<style scoped>
/* ========================================
   CONTENEUR PRINCIPAL
   ======================================== */

.container {
  display: flex;
  gap: 1rem;
}

/* ========================================
   HEADER - EN-TÊTE
   ======================================== */

.header {
  background: white;
  padding: 1rem;
  /* Ombre légère pour séparation */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
}

/* ========================================
   ANIMATIONS
   ======================================== */

/* Transition fluide au changement */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

**Format**: 
- Sections délimitées avec commentaires visuels
- Expliques les styles non évidents

---

## 📊 Checklist de Commentaires

Pour chaque fichier Vue, vérifier:

- [ ] Bloc JSDoc initial au début du script
- [ ] Chaque composable/store commenté
- [ ] Chaque ref a un commentaire JSDoc
- [ ] Computed complexes bien documentés
- [ ] Methodes complexes avec @param, @returns
- [ ] Lifecycle hooks expliqués
- [ ] Sections délimitées avec `// ==`
- [ ] Template a des commentaires de section
- [ ] Pas de commentaires évidents (ex: `// Increment counter`)
- [ ] Français cohérent, pas de mélange

---

## ❌ À Éviter

```javascript
// ❌ MAUVAIS: Trop basique
const count = ref(0) // Le compteur

// ❌ MAUVAIS: Commentaire évident
const handleClick = () => { // Gère le clic
  count.value++
}

// ❌ MAUVAIS: Sans détail
const filteredData = computed(() => {
  // Filtre les données
  return data.filter(...)
})

// ❌ MAUVAIS: Code et commentaire redondants
// Incrémente le compteur
count.value++
```

---

## ✅ À Faire

```javascript
// ✅ BON: Explication du rôle
/** Compteur de produits ajoutés au panier */
const cartCount = ref(0)

// ✅ BON: Explique le cas complexe
/** 
 * Filtre les produits en rupture de stock
 * Utile pour l'affichage du dashboard critique
 * @returns {Array} Produits avec quantité = 0
 */
const outOfStockProducts = computed(() => {
  return products.value.filter(p => p.quantity === 0)
})

// ✅ BON: Explique l'action complexe
/**
 * Synchronise les données avec l'API
 * Gère les erreurs réseau et les timeouts
 * @async
 */
const syncData = async () => {
  // ...
}
```

---

## 🎯 Règles d'Or

1. **Explique le POURQUOI, pas le QUOI**
   - Pourquoi cette variable existe
   - Pourquoi ce calcul est complexe
   - Pourquoi cet appel API est nécessaire

2. **Sois spécifique, pas générique**
   - Au lieu de "Gère les données", dire "Récupère les 10 produits avec le meilleur stock"
   - Au lieu de "État du formulaire", dire "Données du formulaire de création de produit"

3. **Documente les cas d'usage**
   - Quand cette méthode est appelée
   - Quand ce computed change
   - Quand ce hook s'exécute

4. **Inclus des exemples pour logique complexe**
   - Input/Output pour filtres
   - Cas limites
   - Erreurs possibles

5. **Utilise les JSDoc standards**
   - @param pour paramètres
   - @returns pour retours
   - @throws pour erreurs
   - @async pour promesses

---

## 🚀 Exemple Complet

```vue
<!-- 
  ProductForm.vue
  ================
  Formulaire de création/édition de produit
  - Validation des champs
  - Upload d'image produit
  - Calcul automatique des prix
-->

<template>
  <div class="form-wrapper">
    <!-- En-tête du formulaire -->
    <div class="form-header">
      <h2>{{ isEditing ? 'Éditer' : 'Créer' }} Produit</h2>
    </div>

    <!-- Formulaire principal -->
    <form @submit.prevent="handleSubmit">
      <!-- Champ: Nom du produit (obligatoire) -->
      <div class="form-group">
        <label>Nom du Produit *</label>
        <input v-model="form.name" required />
      </div>

      <!-- Champ: Prix de vente avec calcul auto -->
      <div class="form-group">
        <label>Prix de Vente</label>
        <!-- Affiche le prix calculé basé sur le coût et la marge -->
        <input v-model="form.sellingPrice" />
        <small>Basé sur: {{ calculatedPrice }} (marge: {{ marginPercent }}%)</small>
      </div>
    </form>
  </div>
</template>

<script setup>
/**
 * ProductForm.vue - Script Setup
 * 
 * Formulaire pour créer ou éditer un produit
 * Gère:
 * - Validation des champs
 * - Calcul automatique des prix
 * - Upload d'images
 * - Soumission à l'API
 */

import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter, useRoute } from 'vue-router'

// ========================================
// STORES ET ROUTER
// ========================================

/** Store pour la gestion des produits */
const productStore = useProductStore()

/** Router Vue pour la navigation */
const router = useRouter()

/** Route actuelle (peut contenir l'ID pour édition) */
const route = useRoute()

// ========================================
// DONNÉES RÉACTIVES
// ========================================

/** Objet contenant les données du formulaire */
const form = ref({
  name: '',
  costPrice: 0,
  sellingPrice: 0,
  image: null,
  category: '',
})

/** Pourcentage de marge (ex: 20% pour 20% profit) */
const marginPercent = ref(20)

/** Indique si on est en mode édition (true) ou création (false) */
const isEditing = ref(false)

/** État de soumission du formulaire (true = en cours) */
const isSubmitting = ref(false)

// ========================================
// LIFECYCLE HOOKS
// ========================================

/**
 * Hook du cycle de vie: Exécuté au montage du composant
 * 
 * Actions:
 * 1. Vérifie si on est en mode édition (presence d'ID dans route)
 * 2. Charge les données du produit si édition
 * 3. Initialise le formulaire
 */
onMounted(async () => {
  const productId = route.params.id
  
  if (productId) {
    isEditing.value = true
    const product = await productStore.getProduct(productId)
    Object.assign(form.value, product)
  }
})

// ========================================
// PROPRIÉTÉS CALCULÉES
// ========================================

/**
 * Calcule le prix de vente basé sur le coût et la marge
 * 
 * Formule: costPrice * (1 + marginPercent / 100)
 * 
 * @returns {number} Le prix de vente calculé
 * 
 * Exemple:
 * - costPrice: 100, marginPercent: 20
 * - Result: 100 * 1.2 = 120
 */
const calculatedPrice = computed(() => {
  return Math.round(form.value.costPrice * (1 + marginPercent.value / 100) * 100) / 100
})

// ========================================
// MÉTHODES
// ========================================

/**
 * Valide les données du formulaire
 * 
 * Vérifie:
 * - Nom du produit non vide
 * - Coût > 0
 * - Catégorie sélectionnée
 * 
 * @returns {boolean} true si valide, false sinon
 * @throws {Error} Affiche les erreurs de validation
 */
const validateForm = () => {
  if (!form.value.name) {
    showError('Le nom du produit est obligatoire')
    return false
  }
  if (form.value.costPrice <= 0) {
    showError('Le coût doit être > 0')
    return false
  }
  return true
}

/**
 * Soumet le formulaire à l'API
 * 
 * Actions:
 * 1. Valide les données
 * 2. Affiche l'état de soumission
 * 3. Appelle l'API de création/édition
 * 4. Redirige vers la liste de produits
 * 5. Affiche une notification de succès
 * 
 * @async
 */
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await productStore.updateProduct(form.value.id, form.value)
    } else {
      await productStore.createProduct(form.value)
    }
    
    router.push('/products')
    showSuccess('Produit sauvegardé avec succès')
  } catch (error) {
    showError('Erreur lors de la sauvegarde')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

---

**Version**: 1.0
**Dernière mise à jour**: 22 Novembre 2025
**Auteur**: Équipe Développement
