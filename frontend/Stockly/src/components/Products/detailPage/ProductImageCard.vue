<template>
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-4">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-2xl text-red-500">image</span>
            Media
        </h2>
        
        <div
            class="aspect-square rounded-xl mb-4 flex items-center justify-center overflow-hidden group border-4"
            :class="isEditing ? 'border-dashed border-blue-300' : 'border-gray-200'"
        >
            <div v-if="editForm.Prod_image" class="relative w-full h-full">
                <img :src="editForm.Prod_image" :alt="editForm.Prod_name"
                    class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div v-else class="text-center p-8">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-3">image_not_supported</span>
                <p class="text-sm text-gray-400">No image available</p>
            </div>
        </div>

        <div v-if="isEditing" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input v-model="editForm.Prod_image" type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="https://example.com/image.jpg" />
        </div>

        <div class="flex gap-2 justify-center">
            <div
                class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-blue-500 p-1 cursor-pointer hover:shadow-md transition-shadow">
                <img :src="editForm.Prod_image" :alt="product?.Prod_name + ' thumbnail'"
                    class="w-full h-full object-cover rounded-md" v-if="editForm.Prod_image" />
                <div v-else class="text-xs text-gray-400 font-medium">Main</div>
            </div>
            <button
                class="w-1/4 aspect-square bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300 hover:border-blue-400 transition-colors group">
                <span class="material-symbols-outlined text-xl text-gray-400 group-hover:text-blue-500">add_a_photo</span>
            </button>
            <div v-for="i in 2" :key="i"
                class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span class="material-symbols-outlined text-xl text-gray-400">camera</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

// Assurez-vous d'importer les interfaces Product si elles sont dans un fichier séparé
interface Category { id:string|number; name:string }
interface Product {
  id?: string | number
  Prod_name: string
  quantity: number
  cost_price: number
  selling_price: number
  category: Category
  Prod_Description: string
  code_bar: string | number
  date_of_arrival: string
  supplier_name: string | number
  Prod_image?: string
  min_stock_level?: number
  max_stock_level?: number
}

defineProps<{
    product: Product | null
    editForm: Product
    isEditing: boolean
}>()
</script>