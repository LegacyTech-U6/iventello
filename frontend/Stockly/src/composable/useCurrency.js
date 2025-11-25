// src/composables/useCurrency.js
import { computed } from 'vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'

export function useCurrency() {
  const entrepriseStore = useEntrepriseStore()

  // Currency actuelle (réactive)
  const currency = computed(() => entrepriseStore.activeEntreprise?.currency || 'USD')

  /**
   * Formate un montant selon la devise active.
   * Utilise Intl.NumberFormat pour gérer automatiquement :
   * - le symbole de la monnaie
   * - la position du symbole (avant/après)
   * - le nombre de décimales
   */
  const format = (amount) => {
    if (amount == null) return '-'

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.value,
    }).format(amount)
  }

  return {
    currency,
    format,
  }
}
