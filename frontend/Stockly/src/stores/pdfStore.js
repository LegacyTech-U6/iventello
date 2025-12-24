// import { defineStore } from 'pinia'
// import { generateInvoicePdf } from '@/service/api'
// import { buildInvoicePdfHTML } from '@/utils/invoicePdfTemplate'

// export const usePdfStore = defineStore('pdf', {
//   actions: {
//     async downloadInvoicePdf(invoice, entreprise) {
//       const html = buildInvoicePdfHTML(invoice, entreprise)
//       const pdfBlob = await generateInvoicePdf(html)

//       const blob = new Blob([pdfBlob], { type: 'application/pdf' })
//       const url = URL.createObjectURL(blob)

//       const a = document.createElement('a')
//       a.href = url
//       a.download = `invoice-${invoice.id}.pdf`
//       a.click()

//       URL.revokeObjectURL(url)
//     }
//   }
// })
