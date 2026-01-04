<!-- c:\Users\Fillin\Desktop\Project\iventello\frontend\Stockly\src\views\SupplierView.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Fournisseurs</h1>
        <p class="text-gray-500 text-sm">Gérez votre liste de fournisseurs et leurs contacts.</p>
      </div>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
      >
        <span class="text-xl font-bold">+</span> Nouveau
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="supplierStore.loading && !supplierStore.suppliers.length" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="supplierStore.submitError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
      <p class="font-bold">Erreur</p>
      <p>{{ supplierStore.submitError }}</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <th class="p-4 font-semibold">Nom</th>
              <th class="p-4 font-semibold">Contact</th>
              <th class="p-4 font-semibold">Adresse</th>
              <th class="p-4 font-semibold">Canal Préféré</th>
              <th class="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="supplier in supplierStore.suppliers" :key="supplier.id" class="hover:bg-gray-50 transition-colors group">
              <td class="p-4">
                <span class="font-medium text-gray-900 block">{{ supplier.supplier_name }}</span>
              </td>
              <td class="p-4 text-gray-600 text-sm">
                <div class="flex flex-col gap-1">
                  <div v-if="supplier.email" class="flex items-center gap-2">
                    <span class="text-gray-400">✉️</span> {{ supplier.email }}
                  </div>
                  <div v-if="supplier.phone_number" class="flex items-center gap-2">
                    <span class="text-gray-400">📞</span> {{ supplier.phone_number }}
                  </div>
                  <div v-if="supplier.whatsapp_number" class="flex items-center gap-2">
                    <span class="text-green-500">💬</span> {{ supplier.whatsapp_number }}
                  </div>
                </div>
              </td>
              <td class="p-4 text-gray-600 text-sm max-w-xs truncate">
                {{ supplier.supplier_address || '-' }}
              </td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium border"
                  :class="{
                    'bg-green-50 text-green-700 border-green-100': supplier.preferred_channel === 'whatsapp',
                    'bg-blue-50 text-blue-700 border-blue-100': supplier.preferred_channel === 'email',
                    'bg-gray-50 text-gray-700 border-gray-100': !['whatsapp', 'email'].includes(supplier.preferred_channel)
                  }"
                >
                  {{ supplier.preferred_channel || 'Non défini' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openModal(supplier)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Modifier">
                    ✏️
                  </button>
                  <button @click="handleDelete(supplier.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="supplierStore.suppliers.length === 0">
              <td colspan="5" class="p-12 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <span class="text-4xl">📇</span>
                  <p>Aucun fournisseur trouvé.</p>
                  <button @click="openModal()" class="text-blue-600 hover:underline text-sm">Ajouter votre premier fournisseur</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Modifier le fournisseur' : 'Nouveau fournisseur' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du fournisseur <span class="text-red-500">*</span></label>
            <input v-model="form.supplier_name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Samsung Electronics" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone <span class="text-red-500">*</span></label>
              <input v-model="form.phone_number" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+33 6..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input v-model="form.whatsapp_number" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+33 6..." />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="contact@fournisseur.com" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea v-model="form.supplier_address" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Adresse complète"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Canal de communication préféré</label>
            <select v-model="form.preferred_channel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Téléphone</option>
            </select>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium">Annuler</button>
            <button type="submit" :disabled="supplierStore.submitLoading" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm disabled:opacity-70">
              <span v-if="supplierStore.submitLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useSupplierStore } from '@/stores/SupplierStore';

const supplierStore = useSupplierStore();

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

const form = reactive({
  supplier_name: '',
  supplier_address: '',
  phone_number: '',
  email: '',
  whatsapp_number: '',
  preferred_channel: 'email'
});

onMounted(() => {
  supplierStore.fetchSuppliers();
});

const openModal = (supplier = null) => {
  isModalOpen.value = true;
  if (supplier) {
    isEditing.value = true;
    currentId.value = supplier.id;
    // Copie des valeurs pour éviter de modifier le store directement avant sauvegarde
    Object.assign(form, {
      supplier_name: supplier.supplier_name,
      supplier_address: supplier.supplier_address,
      phone_number: supplier.phone_number,
      email: supplier.email,
      whatsapp_number: supplier.whatsapp_number,
      preferred_channel: supplier.preferred_channel || 'email'
    });
  } else {
    isEditing.value = false;
    currentId.value = null;
    resetForm();
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.supplier_name = '';
  form.supplier_address = '';
  form.phone_number = '';
  form.email = '';
  form.whatsapp_number = '';
  form.preferred_channel = 'email';
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await supplierStore.updateSupplier(currentId.value, form);
    } else {
      await supplierStore.createSupplier(form);
    }
    closeModal();
  } catch (error) {
    // L'erreur est gérée dans le store et affichée via supplierStore.submitError
    console.error(error);
  }
};

const handleDelete = async (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.")) {
    try {
      await supplierStore.deleteSupplier(id);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  }
};
</script>
