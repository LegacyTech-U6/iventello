# 💡 Guide de Style des Commentaires

Guide pour maintenir une cohérence dans les commentaires du projet.

---

## 📝 Format d'En-tête de Fichier

Tout fichier Vue/JS doit commencer par:

```vue
<!-- 
  FileName.vue
  =============
  Une courte description du rôle principal (1 ligne)
  - Feature ou responsabilité 1
  - Feature ou responsabilité 2
  - Feature importante 3
  - Interaction avec stores ou composants clés
-->
```

**Exemple:**
```vue
<!-- 
  MainPage.vue
  =============
  Gestionnaire multi-entreprises avec CRUD complet
  - Affiche liste d'entreprises avec stats
  - Permet créer, modifier, supprimer entreprises
  - Recherche et filtrage en temps réel
  - Vue responsive (table desktop, grid mobile)
-->
```

---

## 📂 Commentaires de Section (Template)

### Format
```vue
<!-- 
  SECTION TITLE
  Description courte de la section
-->
<div class="section">
  <!-- Sous-section spécifique -->
  <element />
</div>
```

### Exemples

#### Section principale
```vue
<!-- 
  SECTION PRINCIPALE
  Affichée une fois les données chargées
-->
<div class="max-w-8xl mx-auto"></div>
```

#### En-tête
```vue
<!-- En-tête avec titre et description -->
<div class="mb-4 sm:mb-6">
  <h1>Title</h1>
</div>
```

#### Statistiques
```vue
<!-- Cartes de statistiques en grille -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
```

#### Contrôles
```vue
<!-- SECTION CONTRÔLES: Recherche, filtres, ajouter -->
<div class="bg-white rounded-t-xl shadow-sm border border-gray-200">
```

#### Affichages conditionnels
```vue
<!-- État vide: Aucune entreprise trouvée -->
<div v-if="filteredEntreprises.length === 0">
```

#### Modaux
```vue
<!-- MODAL: Créer/Modifier une entreprise -->
<div v-if="showCreateModal" class="fixed inset-0">
```

---

## 🔧 Commentaires de Script

### Format pour imports
```javascript
// ========================================
// IMPORTS - Description
// ========================================
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useStore } from '@/stores/myStore'
```

### Format pour données réactives
```javascript
// ========================================
// DONNÉES RÉACTIVES
// ========================================
const isOpen = ref(false)        // Affichage du modal
const searchQuery = ref('')      // Terme de recherche
const items = ref([])            // Liste des items
```

### Format pour computed
```javascript
// ========================================
// PROPRIÉTÉS CALCULÉES (COMPUTED)
// ========================================

// Filtre les items selon la recherche
const filteredItems = computed(() => {
  return items.value.filter(item => 
    item.name.includes(searchQuery.value)
  )
})
```

### Format pour méthodes
```javascript
// ========================================
// MÉTHODES
// ========================================

// Ouvre le modal de création
const handleOpen = () => {
  isOpen.value = true
}

// Crée un nouvel item
const createItem = async () => {
  // Logique...
}
```

### Format pour lifecycle
```javascript
// ========================================
// LIFECYCLE HOOKS
// ========================================

onMounted(() => {
  // Au montage du composant
  loadItems()
})

onUnmounted(() => {
  // Avant destruction du composant
  window.removeEventListener('resize', handleResize)
})
```

---

## 🎨 Commentaires de Style

### Transitions
```css
/* ========================================
   ANIMATIONS & TRANSITIONS
   ======================================== */

/* Durée et type de transition */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.5s ease,       /* Fondu */
    transform 0.5s ease;     /* Mouvement */
}

/* Animation d'ENTRÉE */
.page-enter-from {
  opacity: 0;                /* Invisible au départ */
  transform: translateY(20px); /* Commence plus bas */
}

.page-enter-to {
  opacity: 1;                /* Visible */
  transform: translateY(0);  /* Position finale */
}
```

### Responsive
```css
/* ========================================
   RESPONSIVE LAYOUT
   ======================================== */

@media (max-width: 640px) {
  /* Styles pour mobile */
  .mobile-hidden {
    display: none;
  }
}
```

---

## ✅ Checklist Commentaire Composant

Avant de considérer un composant comme "commenté":

```
[ ] En-tête du fichier (rôle + features)
[ ] Imports commentés si complexes
[ ] Template avec sections marquées
[ ] Propriétés réactives commentées
[ ] Computed properties expliquées
[ ] Méthodes commentées (au moins les complexes)
[ ] Lifecycle hooks expliqués
[ ] Style complexe expliqué
[ ] Props expliquées dans defineProps
[ ] Émits expliquées dans defineEmits
```

---

## 🚫 Ce qu'il NE faut PAS faire

### ❌ Commentaires inutiles
```javascript
// ❌ MAUVAIS
const count = ref(0)  // Initialise count à 0
count.value++         // Augmente count
```

### ✅ Bons commentaires
```javascript
// ✅ BON
// Compte le nombre d'items sélectionnés
const selectedCount = ref(0)
selectedCount.value++  // Incrémente lors d'une sélection
```

---

## 🎯 Niveaux de Détail

### Niveau 1: Fichiers simples (< 50 lignes)
```
✅ En-tête fichier
✅ Commentaires sections principales
✅ Pas besoin détails excessifs
```

### Niveau 2: Fichiers moyens (50-200 lignes)
```
✅ En-tête fichier détaillé
✅ Sections marquées clairement
✅ Props et émits commentées
✅ Logique complexe expliquée
```

### Niveau 3: Fichiers complexes (> 200 lignes)
```
✅ En-tête fichier très détaillé
✅ Toutes sections marquées
✅ Tous imports groupés et expliqués
✅ Toutes réactif data expliquées
✅ Toutes computed expliquées
✅ Toutes méthodes documentées
✅ Lifecycle hooks expliqués
✅ Flux de données clarifié
```

---

## 📚 Template Complet

Utilisez ce template pour les fichiers complexes:

```vue
<!-- 
  ComponentName.vue
  ===================
  Courte description du rôle principal
  - Feature 1
  - Feature 2
  - Feature importante
-->

<!-- 
  STRUCTURE:
  - Header section
  - Main content
  - Footer/Actions
-->

<template>
  <!-- SECTION PRINCIPALE -->
  <div class="container">
    <!-- En-tête -->
    <header>
      <h1>{{ title }}</h1>
    </header>
    
    <!-- Contenu principal -->
    <main>
      <!-- Items list -->
    </main>
    
    <!-- Modal ou actions -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ComponentA from '@/components/ComponentA.vue'
import { useStore } from '@/stores/store'

// ========================================
// STORES & EXTERNAL
// ========================================
const store = useStore()

// ========================================
// DONNÉES RÉACTIVES
// ========================================
// État du modal
const showModal = ref(false)
// Terme de recherche
const searchQuery = ref('')
// Liste des items
const items = ref([])

// ========================================
// PROPRIÉTÉS CALCULÉES
// ========================================
// Filtre items selon recherche
const filteredItems = computed(() => {
  return items.value.filter(item =>
    item.name.includes(searchQuery.value)
  )
})

// ========================================
// MÉTHODES
// ========================================
// Ouvre le modal
const openModal = () => {
  showModal.value = true
}

// Ferme le modal
const closeModal = () => {
  showModal.value = false
}

// ========================================
// LIFECYCLE
// ========================================
onMounted(async () => {
  // Charge les items au montage
  items.value = await store.fetchItems()
})
</script>

<style scoped>
/* ========================================
   LAYOUT & STYLES
   ======================================== */
.container {
  /* Main container style */
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 640px) {
  /* Mobile styles */
}
</style>
```

---

## 🔗 Références Utiles

- **Vue 3 Docs**: https://vuejs.org/
- **TypeScript**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 💬 Besoin d'aide?

Consultez:
1. Ce guide de style
2. Les fichiers déjà commentés comme modèles
3. COMPONENTS_GUIDE.md pour la structure
4. COMMENTS_ADDED_SUMMARY.md pour les exemples

---

**Version**: 1.0  
**Dernière mise à jour**: 22 novembre 2025  
**Mainteneur**: Development Team
