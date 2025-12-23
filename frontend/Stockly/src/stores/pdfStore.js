import { defineStore } from 'pinia'
import { generateInvoicePdf } from '@/service/api'
import { buildInvoicePdfHTML } from '@/utils/invoicePdfTemplate'

export const usePdfStore = defineStore('pdf', {
  actions: {
    async downloadInvoicePdf(invoice, entreprise) {
      console.log('=== downloadInvoicePdf ===')
      console.log('Invoice data:', invoice)
      console.log('Entreprise data:', entreprise)

      const html = buildInvoicePdfHTML(invoice, entreprise)
      console.log('Generated HTML length:', html.length)

      const pdfBlob = await generateInvoicePdf(html)
      console.log('PDF Blob received:', pdfBlob)

      const blob = new Blob([pdfBlob], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.id}.pdf`
      a.click()

      URL.revokeObjectURL(url)
      console.log('PDF download triggered successfully')
    }
  }
})
