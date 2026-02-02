<template>
  <Teleport to="body">
    <div class="absolute inset-0 w-full h-full z-50 backdrop-blur-sm overflow-y-auto flex justify-center py-10"
      style="background-color: rgba(0, 0, 0, 0.85);">
      <div class="absolute top-4 left-0 w-full px-6 flex justify-between items-start z-[60] pointer-events-none">
        <button @click="$emit('close')"
          class="pointer-events-auto bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
          <XMarkIcon class="h-6 w-6" />
        </button>

        <div class="pointer-events-auto flex items-center gap-2 backdrop-blur-md p-2 rounded-lg border shadow-xl"
          style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);">


          <button @click="printInvoice"
            class="bg-white text-gray-800 px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm">
            <PrinterIcon class="h-4 w-4" />
            Print
          </button>

          <button @click="downloadPDF" :disabled="isActionLoading"
            class="text-white px-4 py-2 rounded-md font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-lg min-w-[80px] bg-black hover:bg-gray-800">
            <n-spin v-if="isActionLoading" size="small" stroke="white" />
            <CheckCircleIcon v-if="!isActionLoading" class="h-4 w-4" />
            <span>{{ isActionLoading ? 'Creating...' : 'Confirm' }}</span>
          </button>
        </div>
      </div>
      <div class="max-w-[210mm]">


        <div class="p-1">
          <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
            <n-spin size="large" />
            <p class="text-gray-500 animate-pulse">Loading invoice data...</p>
          </div>

          <div v-else ref="invoiceContent" class="invoice-content">
            <!-- Classic Invoice Layout -->
            <CompanyInfo :entreprise="entrepriseData" />

            <div class="invoice-grid">
              <div class="invoice-header-section">
                <InvoiceHeader :invoiceNumber="invoice.id" :creationDate="invoice.date"
                  :dueDate="invoice.date_echeance || invoice.dueDate" />
              </div>
              <div class="client-section">
                <BillTo :client="clientData" />
              </div>
            </div>

            <InvoiceItemsTable :items="invoice.items" />
            <InvoiceSummary :items="invoice.items" :discount="invoice.discount" :tax="invoice.tax"
              :tax-rate="invoice.taxRate" />
            <PaymentTerms />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import CompanyInfo from './CompanyInfo.vue'
import InvoiceHeader from './InvoiceHeader.vue'
import BillTo from './BillTo.vue'
import InvoiceItemsTable from './InvoiceItemsTable.vue'
import InvoiceSummary from './InvoiceSummary.vue'
import PaymentTerms from './PaymentTerms.vue'
import { ref, onMounted, computed } from 'vue'
import { NSpin } from 'naive-ui'
import { useActionMessage } from '@/composable/useActionMessage'
import { exportToPDF } from '@/utils/invoicePdfTemplate'
import { useInvoiceStore } from '@/stores/FactureStore'
import { useClientStore } from '@/stores/clientStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
const { showSuccess, showError } = useActionMessage()
import { useGlobalModal } from '@/composable/useValidation'
const { show } = useGlobalModal()
const entreprise = useEntrepriseStore()
const clientStore = useClientStore()
const invoiceContent = ref(null)
const loading = ref(true)
const invoiceStore = useInvoiceStore()
const isActionLoading = ref(false)
const props = defineProps({
  invoice: Object,
})

onMounted(async () => {
  try {
    console.log('Fetching client with ID:', props.invoice.client_id)
    await clientStore.fetchClientById(props.invoice.client_id)

    // ✅ CORRECTION : Passer l'ID de l'entreprise active
    if (entreprise.activeEntreprise && entreprise.activeEntreprise.id) {
      await entreprise.fetchEntrepriseById(entreprise.activeEntreprise.id)
    }

    console.log('Selected Client after fetch:', clientStore.selectedClient)
    console.log('Current Entreprise:', entreprise.currentEntreprise)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})

// Add a computed property to check if client data is available
const clientData = computed(() => {
  console.log('Current selectedClient:', clientStore.selectedClient)
  return clientStore.selectedClient
})

// Ajouter aussi les données de l'entreprise pour CompanyInfo
const entrepriseData = computed(() => {
  return entreprise.currentEntreprise || entreprise.activeEntreprise
})
const emit = defineEmits(['close'])
async function downloadPDF() {
  isActionLoading.value = true
  try {
    // Étape 1️⃣ — Créer la facture côté backend
    await invoiceStore.createInvoice(props.invoice)

    // Étape 2️⃣ — Afficher un message de succès
    show('Invoice created successfully! Preparing for print...', 'success')
    const clientName = clientData.value?.client_name || 'customer'
    const fileName = `invoice-${clientName}-${props.invoice.id}.pdf`
    console.log('Invoice content:', invoiceContent.value)
    // Étape 4️⃣ — Appeler l'export vers PDF
    await exportToPDF(invoiceContent.value, fileName)

    // Étape 5️⃣ — Fermer la modale après impression
    emit('close')
  } catch (err) {
    console.error(err)
    show(err.message || 'Failed to print invoice', 'error')
  } finally {
    isActionLoading.value = false
  }
}

function printInvoice() {
  const printContent = invoiceContent.value.innerHTML

  // Remplace tout le body temporairement par le contenu de la facture
  document.body.innerHTML = printContent

  // Lance l’impression
  window.print()

}

</script>
<style scoped>
.invoice-content {
  padding: 2rem;
  background: white;
}

.invoice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 1.5rem 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary {
  background: #000;
  color: white;
  border-color: #000;
}

.btn-secondary {
  background: #666;
  color: white;
  border-color: #666;
}

@media (max-width: 768px) {
  .invoice-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media print {
  .action-buttons {
    display: none;
  }
}
</style>
