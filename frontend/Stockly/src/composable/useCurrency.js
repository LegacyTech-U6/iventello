// src/composables/useCurrency.js
import { computed } from 'vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'

export function useCurrency() {
  const entrepriseStore = useEntrepriseStore()

  // Currency actuelle (réactive)
  const currency = computed(() => entrepriseStore.activeEntreprise?.currency || 'USD')

  /**
   * Formate un montant selon la devise active.
   */
  const format = (amount) => {
    if (amount == null) return '-'

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.value,
    }).format(amount)
  }

  /**
   * Retourne un style CSS pour ajuster la taille du texte en fonction de la longueur du montant formaté.
   * Cela évite les débordements d'interface pour les grands nombres.
   */
  const getDynamicStyle = (amount) => {
    const formatted = format(amount)
    const length = formatted.length

    // Formule inversement proportionnelle : plus le texte est long, plus la police diminue.
    // Base : Taille normale jusqu'à 10 caractères.
    // Au-delà, on réduit de manière fluide.
    const baseLength = 10
    const minScale = 0.6 // On ne descend pas en dessous de 60% de la taille initiale

    let scale = 1
    if (length > baseLength) {
      // On réduit d'environ 2.5% par caractère supplémentaire
      scale = Math.max(minScale, 1 - (length - baseLength) * 0.025)
    }

    return {
      fontSize: `${scale}em`,
      whiteSpace: 'nowrap',
      // On s'assure que le changement de taille ne casse pas l'alignement vertical
      verticalAlign: 'middle',
      display: 'inline-block', // Réintroduit prudemment avec verticalAlign
    }
  }

  return {
    currency,
    format,
    getDynamicStyle,
  }
}
