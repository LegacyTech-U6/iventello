<!-- 
  CartItem.vue
  =============
  Ligne d'article dans le panier
  - Affiche le nom du produit et le prix
  - Contrôles de quantité (+/-)
  - Bouton supprimer l'article
  - Calcul du total (prix × quantité)
-->
<template>
  <!-- Ligne du panier -->
  <div class="cart-item bg-white border-b border-gray-200 py-3">
    <div class="flex items-center justify-between">
      <!-- Informations et contrôles -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="p-1 flex items-center gap-1">
            <!-- Bouton supprimer l'article -->
            <button @click="$emit('remove-item', item.id)"
              class="text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center rounded transition-colors">
              <TrashIcon class="w-4 h-4" />
            </button>
            <!-- Nom du produit -->
            <p class="font-medium text-gray-900 text-sm">{{ item.Prod_name }}</p>
          </div>

          <!-- Contrôles de quantité -->
          <div class="flex">
            <!-- Bouton diminuer -->
            <button @click="decreaseQuantity"
              class="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
              <span class="text-sm font-bold">-</span>
            </button>

            <!-- Affichage de la quantité -->
            <span class="text-sm text-gray-700 min-w-6 text-center">{{ item.quantity }}</span>

            <!-- Bouton augmenter -->
            <button @click="increaseQuantity"
              class="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
              <span class="text-sm font-bold">+</span>
            </button>
          </div>
          <!-- Total (prix × quantité) -->
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">
              ${{ (item.selling_price * item.quantity).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Coût/Prix -->
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-item', 'remove-item'])

const increaseQuantity = () => {
  const updatedItem = {
    ...props.item,
    quantity: props.item.quantity + 1,
  }
  emit('update-item', updatedItem)
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    const updatedItem = {
      ...props.item,
      quantity: props.item.quantity - 1,
    }
    emit('update-item', updatedItem)
  } else {
    emit('remove-item', props.item.id)
  }
}
</script>
