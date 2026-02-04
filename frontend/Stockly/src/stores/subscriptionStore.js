import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const billingCycle = ref('monthly') // 'monthly' | 'yearly'

  const plans = ref([
    {
      id: 'standard',
      name: 'Standard',
      price: { monthly: 29, yearly: 290 },
      description: "L'essentiel pour démarrer votre activité.",
      features: [
        'Gestion de stock (1000 ref)',
        'Commandes & Factures illimitées',
        'CRM Clients & Fournisseurs',
        'Support email standart',
      ],
      popular: false,
      buttonText: 'Commencer',
      available: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 59, yearly: 590 },
      description: 'Pour les entreprises en croissance.',
      features: [
        'Tout du plan Standard',
        "Multi-utilisateurs (jusqu'à 5)",
        'Analytiques avancées',
        'Application Mobile',
        'Gestion des rôles (RBAC)',
      ],
      popular: true,
      buttonText: 'Commencer',
      available: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 99, yearly: 990 },
      description: 'La puissance totale pour les experts.',
      features: [
        'Tout du plan Pro',
        "Multi-entreprises (jusqu'à 3)",
        'Support prioritaire 24/7',
        'Export Comptable Automatisé',
        'API Access',
      ],
      popular: false,
      buttonText: 'Commencer',
      available: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 'Sur devis', yearly: 'Sur devis' },
      description: 'Solutions sur mesure pour grands comptes.',
      features: [
        'Tout du plan Premium',
        'Utilisateurs illimités',
        'Déploiement personnalisé',
        'Account Manager dédié',
        'SLA garantis',
      ],
      popular: false,
      buttonText: 'Contacter',
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
