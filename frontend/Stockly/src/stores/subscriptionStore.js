import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const billingCycle = ref('monthly') // 'monthly' | 'yearly'

  const plans = ref([
    {
      id: 'free',
      name: 'Free (Découverte)',
      price: { monthly: 0, yearly: 0 },
      description: 'Pour petits commerces / tests',
      features: [
        '1 entreprise',
        '1 admin, 2 workers',
        '100 produits',
        'Facturation basique',
        'Dashboard basique',
        'POS & Gestion (Produits, Clients, Dépenses)',
      ],
      popular: false,
      buttonText: 'Commencer',
      available: true,
    },
    {
      id: 'pro',
      name: 'Pro (Cœur du business)',
      price: { monthly: 49, yearly: 490 },
      description: 'PME et commerces actifs',
      features: [
        'Tout du plan FREE',
        '1 entreprise',
        '5 admins, 10 workers',
        '2 000 produits',
        'Facturation complète & Export PDF',
        'Rapports dynamiques & Filtres (Jour/Semaine...)',
        'Alertes stock & Notifications',
        'Audit Trail & Import/Export Excel',
      ],
      popular: true,
      buttonText: 'Essayer gratuitement',
      available: true,
    },
    {
      id: 'business',
      name: 'Business (Avancé)',
      price: { monthly: 149, yearly: 1490 },
      description: 'Entreprises structurées',
      features: [
        'Tout du plan PRO',
        'Utilisateurs illimités',
        'Produits illimités',
        'Multi-caisses POS',
        'Logs avancés & Rapports consolidés',
        'Support prioritaire',
        'Paramètres entreprise avancés',
      ],
      popular: false,
      buttonText: 'Nous contacter',
      available: true,
    },
  ])

  const toggleBillingCycle = () => {
    billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
  }

  return {
    billingCycle,
    plans,
    toggleBillingCycle,
  }
})
