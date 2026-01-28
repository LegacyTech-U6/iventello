<template>
  <div class="bg-white rounded-[2rem] p-4 mb-3 border border-gray-100 shadow-sm flex items-center gap-4 relative group">
    
       <div class="w-24 h-24 bg-[#F8F9FA] rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-50">
      <img 
        :src="item.Prod_image || 'https://placehold.co/200x200?text=No+Image'" 
        :alt="item.Prod_name" 
        class="w-full h-full object-cover p-2 transition-transform group-hover:scale-110" 
      />
    </div>

    <div class="flex-1 flex flex-col gap-2">
      <div class="flex justify-between items-start">
        <h4 class="font-bold text-[#1A1A1A] text-lg leading-tight">{{ item.Prod_name }}</h4>
        
        <button 
          @click="$emit('remove-item', item.id)"
          class="bg-[#E91E63] hover:bg-red-600 text-white p-2 rounded-full transition-all shadow-sm active:scale-90"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>

   

      <div class="flex items-center justify-between mt-1">
        
        <div class="flex items-center gap-4 bg-white border border-gray-100 rounded-full p-1">
          <button 
            @click="decreaseQuantity"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all active:scale-90"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
          
          <span class="font-bold text-[#1A1A1A] text-sm min-w-[20px] text-center">
            {{ item.quantity < 10 ? '0' + item.quantity : item.quantity }}
          </span>
          
          <button 
            @click="increaseQuantity"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-[#DFFF00] text-black hover:bg-[#c8e600] transition-all shadow-sm active:scale-90"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="text-right">
          <span class="text-gray-400 text-[9px] font-bold mr-1 uppercase tracking-tighter">Total: </span>
          <span class="font-black text-[#1A1A1A] text-md">
            {{ format(item.selling_price * item.quantity) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'
import { useCurrency } from '@/composable/useCurrency'

const {format} = useCurrency()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-item', 'remove-item'])

// Fonction pour augmenter la quantité
const increaseQuantity = () => {
  const updatedItem = {
    ...props.item,
    quantity: props.item.quantity + 1,
  }
  emit('update-item', updatedItem)
}

// Fonction pour diminuer la quantité
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    const updatedItem = {
      ...props.item,
      quantity: props.item.quantity - 1,
    }
    emit('update-item', updatedItem)
  } else {
    // Si on descend en dessous de 1, on propose de supprimer
    emit('remove-item', props.item.id)
  }
}
</script>

<style scoped>
/* Ajout d'une ombre personnalisée très légère pour le bouton jaune */
.shadow-sm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>