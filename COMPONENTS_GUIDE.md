# 📚 Guide Complet des Composants et Views

## Vue d'ensemble du projet

Ce document fournit une explication détaillée de chaque composant et view du projet pour faciliter la compréhension et la maintenance.

---

## 📁 VIEWS (Pages principales)

### Views avec commentaires ✅

#### 1. **AdminLayout.vue** ✅
- **Rôle**: Layout principal pour toutes les pages admin
- **Fonction**: Enveloppe la navbar avec les routes admin, ajoute transitions fluides
- **Enfants**: NavbarAdmin, router-view
- **Utilisation**: Pages admin authentifiées

#### 2. **HomeView.vue** ✅
- **Rôle**: Page d'accueil/landing
- **Fonction**: Affiche sections marketing (Hero, Features, Pricing, Testimonials)
- **Enfants**: HeroSection, FeatureSection, CharacTeristics, WorflowSection, StatsSection, PricingSection, CtaSection
- **Utilisation**: Page publique d'accueil

#### 3. **LayoutPage.vue** ✅
- **Rôle**: Layout pour pages d'authentification
- **Fonction**: Contient navbar simplifié pour Login, Register, ForgotPassword
- **Enfants**: LoginNav, router-view
- **Utilisation**: Pages d'authentification (non authentifiées)

#### 4. **MainPage.vue** ✅
- **Rôle**: Gestionnaire multi-entreprises
- **Fonction**: Affiche liste entreprises, création/modification, statistiques
- **Features**: Recherche, filtrage, vue grid/table (responsive)
- **Stores**: useEntrepriseStore, useAuthStore
- **Enfants**: EnterpriseTable, EnterpriseGrid, GridCard, ImageUploader, LazyLoader

#### 5. **ClientManager.vue** ✅
- **Rôle**: Gestionnaire de clients
- **Fonction**: CRUD clients, recherche, filtrage par statut
- **Features**: Refresh, ajouter, éditer, supprimer clients
- **Stores**: useClientStore
- **État**: search, statusFilter, loadingClients

#### 6. **InvoiceView.vue** ✅
- **Rôle**: Gestionnaire de factures
- **Fonction**: Affiche liste factures avec filtres avancés
- **Filtres**: Client, Statut, Tri (Date, Montant, Client)
- **Stores**: useInvoiceStore
- **État**: searchQuery, selectedCustomer, selectedStatus, sortBy

#### 7. **RoleManagement.vue** ✅
- **Rôle**: Gestionnaire de rôles
- **Fonction**: CRUD rôles, assignation permissions
- **Features**: Recherche, création modale, gestion permissions
- **Stores**: useRoleStore
- **Statistiques**: Total roles, Permissions count, Users with role

#### 8. **ProductView.vue** (en cours)
- **Rôle**: Gestionnaire d'inventaire produits
- **Fonction**: Vue grille/liste produits, statistiques stock
- **Liens rapides**: Out of Stock, Low Stock
- **Stores**: useProductStore
- **État**: viewMode (grid/list), search

#### 9. **SalesInterface.vue** ✅
- **Rôle**: Point de vente (POS)
- **Fonction**: Créer vente/facture, ajouter produits au panier
- **Layout**: Responsive (desktop: 2 colonnes, mobile: modal)
- **Enfants**: ProductSelector, ClientSelector, SaleCart, CartItem
- **État**: saleItems, selectedClient, showCartModal

#### 10. **WorkerPage.vue** ✅
- **Rôle**: Gestionnaire d'employés
- **Fonction**: CRUD employés, vue liste/grille, statistiques
- **Actions**: Export PDF/CSV, rafraîchir, trier
- **Stores**: useWorkerStore
- **Stats**: Total, Active, Inactive, On Leave

#### 11. **CategoryView.vue** ✅
- **Rôle**: Gestionnaire de catégories
- **Fonction**: CRUD catégories, statistiques
- **Stats**: Total catégories, Total produits, Catégories vides
- **Stores**: useCategoryStore

### Views restantes à commenter

#### 12. **ProductDetailPage.vue**
- Affiche détail complet d'un produit
- Historique stock, mouvements, variantes

#### 13. **RestockView.vue**
- Interface de réapprovisionnement stock
- Commandes fournisseurs, historique restockage

#### 14. **SalesReport.vue**
- Rapports de ventes par période
- Graphiques, analyses, exports

#### 15. **LowStock.vue**
- Affiche produits en quantité faible
- Alertes et recommandations restockage

#### 16. **OutofStock.vue**
- Affiche produits rupture de stock
- Options restockage rapide

#### 17. **Enterprise.vue**
- Détails d'une entreprise spécifique
- Paramètres et configurations

#### 18. **ActivityLogPage.vue**
- Historique activités utilisateurs
- Audit logs, changements système

#### 19. **ForgotPassword.vue** (dossier auth/)
- Récupération mot de passe
- Envoi email réinitialisation

---

## 🧩 COMPOSANTS RÉUTILISABLES

### Composants avec commentaires ✅

#### **UI & Affichage**

##### 1. **NavBar.vue** ✅
- Logo + Menu navigation landing
- Responsive (menu hamburger mobile)
- Scroll detection pour style dynamique

##### 2. **NavbarAdmin.vue**
- Navbar pour section admin
- Menus, user profile, déconnexion

##### 3. **LoginNav.vue**
- Navbar simplifié pour pages auth
- Logo + liens rapides

##### 4. **DashboardHeader.vue** ✅
- En-tête dashboard
- Titre, description, boutons actions (Overview, Analytics, Export)

##### 5. **FooTer.vue**
- Pied de page landing
- Copyright, liens, contact

##### 6. **SectionTitle.vue**
- Titre réutilisable pour sections
- Icône + texte + description

#### **Boutons & Inputs**

##### 7. **BaseButton.vue** ✅
- Bouton réutilisable
- Couleur et texte personnalisables
- Support icônes (avant/après)

##### 8. **AlertCard.vue**
- Carte d'alerte/notification
- Icône + message + actions

##### 9. **NavLink.vue**
- Lien navigation
- Active/inactive states

#### **Sélecteurs & Modaux**

##### 10. **ClientSelector.vue** ✅
- Sélecteur client avec recherche
- Navigation clavier, option Walk-in
- Bouton ajouter client

##### 11. **ProductSelector.vue**
- Sélecteur produits
- Filtre par catégorie, prix, stock

##### 12. **CategoryCard.vue**
- Carte catégorie produit
- Image, nom, count produits

##### 13. **AddCategoryModal.vue**
- Modal créer/éditer catégorie
- Validation formulaire

##### 14. **RestockModal.vue**
- Modal restockage
- Quantité, fournisseur, date livraison

#### **Cartes & Affichages**

##### 15. **ProductCard.vue** ✅
- Carte produit
- Image, nom, catégorie, prix
- Bouton ajouter (disabled si stock=0)

##### 16. **EnterpriseCard.vue**
- Carte entreprise
- Logo, nom, description
- Actions (voir, éditer)

##### 17. **StatCard.vue**
- Carte statistique
- Icône, valeur, label
- Gradient coloring

##### 18. **LowStockCard.vue**
- Alerte stock faible
- Info produit + quantité minimale

##### 19. **OutOfStockCard.vue**
- Alerte rupture stock
- Info produit + options restockage

##### 20. **TopWorkerCard.vue**
- Carte top employé
- Performance, ventes, bonus

#### **Listes & Tableaux**

##### 21. **CartItem.vue** ✅
- Ligne panier
- Nom, prix, quantité (+/-), total
- Bouton supprimer

##### 22. **SaleCart.vue**
- Panier complet
- Liste articles, total, taxes
- Bouton passer commande

##### 23. **PricingSummary.vue**
- Résumé prix/totaux
- Sous-total, taxes, remise, total

#### **Graphiques & Visualisations**

##### 24. **SalesTrendChart.vue**
- Graphique tendance ventes
- Chart.js (ligne ou barre)
- Par période (jour/mois/année)

##### 25. **StartsCards.vue**
- Grille cartes statistiques
- Metrics principales

#### **Utilitaires**

##### 26. **TheWelcome.vue**
- Composant bienvenue
- Message personnalisé + actions

##### 27. **HelloWorld.vue**
- Composant test/template
- Utilisé dans les exemples

##### 28. **RolePage.vue**
- Affichage rôle et permissions
- Détail complet

##### 29. **WelcomeItem.vue**
- Item dans les listes de bienvenue

##### 30. **SteeperComponent.vue**
- Composant stepper/wizard
- Navigation multi-étapes

---

## 📂 STRUCTURE DES DOSSIERS

### `/components/Navbar/`
- Composants navbar variantes
- Navbar admin, login, public

### `/components/Enterprise/`
- EnterpriseCard.vue
- EnterpriseTable.vue
- EnterpriseGrid.vue

### `/components/Products/`
- ProductCard.vue
- ProductSelector.vue
- ProductCategoryFilter.vue

### `/components/clients/`
- ClientCard.vue
- ClientList.vue
- ClientForm.vue

### `/components/invoices/`
- InvoiceList.vue
- InvoiceForm.vue
- InvoicePreview.vue

### `/components/workers/`
- WorkerCard.vue
- WorkerList.vue
- WorkerForm.vue

### `/components/reports/`
- ReportCard.vue
- ReportChart.vue
- ReportFilters.vue

### `/components/statistics/`
- StatCard.vue
- StatChart.vue
- StatGrid.vue

### `/components/ui/`
- AlertCard.vue
- BaseButton.vue
- NavLink.vue
- LazyLoader.vue
- Modal.vue
- etc.

### `/components/landing/`
- HeroSection.vue
- FeatureSection.vue
- PricingSection.vue
- TestimonialMain.vue
- CtaSection.vue
- etc.

### `/components/main/`
- ImageUploader.vue
- FormInput.vue
- DatePicker.vue
- etc.

### `/components/icons/`
- Tous les composants icônes SVG
- TechIcon.vue
- Iventello.vue

---

## 🎯 Principes de Conception

### Props
```typescript
// Chaque composant utilise setup + defineProps
defineProps<{
  propertyName: Type  // Required
  optionalProp?: Type // Optional
}>()
```

### Events
```typescript
// Émission d'événements
emits(['event-name', 'another-event'])
$emit('event-name', payload)
```

### Reactive Data
```typescript
const state = ref(initialValue)
const computed = computed(() => computation)
```

### Scoped Styling
```vue
<style scoped>
/* Styles isolés au composant */
</style>
```

---

## 🔄 Flux de Données

### Views → Composants
```
Views (MainPage.vue)
  ↓
  └─→ Stores (useEntrepriseStore)
  ├─→ EnterpriseTable.vue
  ├─→ EnterpriseGrid.vue
  ├─→ GridCard.vue
  └─→ Modal + ImageUploader.vue
```

### Composants → Events
```
Composant enfant
  ↓
  └─→ $emit('action', data)
  ↓
  Parent reçoit et traite
```

---

## ✅ Checklist Commentaires

### Views
- [x] AdminLayout.vue
- [x] HomeView.vue
- [x] MainPage.vue
- [x] LayoutPage.vue
- [x] ClientManager.vue
- [x] InvoiceView.vue
- [x] RoleManagement.vue
- [x] SalesInterface.vue
- [x] WorkerPage.vue
- [x] CategoryView.vue
- [ ] ProductView.vue
- [ ] ProductDetailPage.vue
- [ ] RestockView.vue
- [ ] SalesReport.vue
- [ ] LowStock.vue
- [ ] OutofStock.vue
- [ ] Enterprise.vue
- [ ] ActivityLogPage.vue
- [ ] ForgotPassword.vue + auth/

### Composants principaux
- [x] NavBar.vue
- [x] BaseButton.vue
- [x] ProductCard.vue
- [x] DashboardHeader.vue
- [x] CartItem.vue
- [x] ClientSelector.vue
- [ ] NavbarAdmin.vue
- [ ] Tous les composants dans ui/
- [ ] Tous les composants dans landing/
- [ ] Tous les composants dans Enterprise/
- [ ] Tous les composants dans Products/
- [ ] Tous les composants dans invoices/
- [ ] Tous les composants dans workers/
- [ ] Tous les composants dans statistics/

---

## 📝 Template Commentaire Composant

```vue
<!-- 
  ComponentName.vue
  ===================
  Courte description du rôle
  - Bullet point 1
  - Bullet point 2
  - Feature importante
-->
<template>
  <!-- Commentaires inline pour sections -->
  <div>
    <!-- Explication de chaque partie -->
  </div>
</template>

<script setup>
// Imports groupés
import { ref, computed } from 'vue'

// ========================================
// REACTIVE DATA
// ========================================
const state = ref(false)

// ========================================
// COMPUTED
// ========================================
const derivedValue = computed(() => {})

// ========================================
// METHODS
// ========================================
const handleAction = () => {}
</script>

<style scoped>
/* Styles locaux au composant */
</style>
```

---

## 🚀 Prochaines Étapes

1. ✅ Commenter les 10 views principales
2. ✅ Commenter 6 composants principaux
3. ⏳ Continuer avec les composants restants
4. ⏳ Ajouter exemples d'utilisation
5. ⏳ Créer diagrammes de flux

---

**Généré le**: 22 novembre 2025
**Statut**: En cours d'actualisation
**Mainteneur**: Development Team
