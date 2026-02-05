import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generates a branded PDF report for the enterprise.
 * @param {Object} options Configuration object for the report
 * @param {Object} options.enterprise Enterprise details (name, logo_url, address, phone, email, currency)
 * @param {string} options.title specific title of the report (e.g., "Rapport Mensuel")
 * @param {string} options.period Period description (e.g., "Janvier 2026")
 * @param {Array} options.sections Array of section objects to include in the report
 *    Each section object can have:
 *    - title: string (Section header)
 *    - type: 'table' | 'stats' | 'text'
 *    - columns: Array (for table)
 *    - data: Array (for table)
 *    - content: string (for text)
 *    - stats: Array of { label, value, color } (for stats grid)
 */
export const generateEnterpriseReport = async ({
  enterprise,
  title,
  period,
  sections = [],
  fileName = 'report.pdf',
}) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 14
  let yPos = 20

  // Helper for currency formatting
  const currency = enterprise?.currency || 'XAF'
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(val)
  }

  // --- HEADER ---
  // Logo
  if (enterprise?.logo_url) {
    try {
      // Create an image element to load the URL
      const img = new Image()
      img.src = enterprise.logo_url
      // await img.decode() // Optional: wait for decode if needed, but in browser context usually handled by addImage if base64 or ensuring load
      // Ideally convert to base64 if it's a remote URL to avoid CORS issues in jsPDF
      // For now, assuming local or properly CORS-configured URL, or base64.
      // If valid, add to doc.
      // doc.addImage(enterprise.logo_url, 'JPEG', margin, 10, 20, 20)
    } catch (e) {
      console.warn('Could not load logo for PDF', e)
    }
  }

  // Enterprise Name & Details
  doc.setFontSize(18)
  doc.setTextColor(41, 128, 185) // Primary Blue
  doc.text(enterprise?.name || 'My Enterprise', margin, yPos)

  yPos += 7
  doc.setFontSize(10)
  doc.setTextColor(100)
  if (enterprise?.location) {
    doc.text(enterprise.location, margin, yPos)
    yPos += 5
  }
  if (enterprise?.email) {
    doc.text(enterprise.email, margin, yPos)
    yPos += 5
  }
  if (enterprise?.phone) {
    doc.text(enterprise.phone, margin, yPos)
    yPos += 5
  }

  // Report Title & Date (Right aligned)
  doc.setFontSize(22)
  doc.setTextColor(0)
  doc.text(title, pageWidth - margin, 25, { align: 'right' })

  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text(`Période : ${period}`, pageWidth - margin, 35, { align: 'right' })
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, 42, {
    align: 'right',
  })

  // Divider
  yPos = Math.max(yPos, 50) + 5
  doc.setDrawColor(200)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // --- SECTIONS ---
  for (const section of sections) {
    // Check page break
    if (yPos > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }

    // Section Title
    if (section.title) {
      doc.setFontSize(14)
      doc.setTextColor(50)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, margin, yPos)
      yPos += 8
      doc.setFont('helvetica', 'normal')
    }

    if (section.type === 'stats') {
      // Grid of statistics
      const statWidth = (pageWidth - margin * 2) / 3
      let xPos = margin

      section.stats.forEach((stat, index) => {
        // Background box
        doc.setFillColor(245, 247, 250)
        doc.roundedRect(xPos, yPos, statWidth - 5, 20, 3, 3, 'F')

        // Label
        doc.setFontSize(9)
        doc.setTextColor(100)
        doc.text(stat.label, xPos + 5, yPos + 7)

        // Value
        doc.setFontSize(12)
        doc.setTextColor(0)
        doc.setFont('helvetica', 'bold')
        doc.text(String(stat.value), xPos + 5, yPos + 15)
        doc.setFont('helvetica', 'normal')

        xPos += statWidth

        // Wrap to next row if every 3rd item
        if ((index + 1) % 3 === 0) {
          xPos = margin
          yPos += 25
        }
      })

      // Adjust yPos if row wasn't full or finished
      if (section.stats.length % 3 !== 0) {
        yPos += 25
      } else {
        // already incremented
      }
      yPos += 5
    } else if (section.type === 'table') {
      autoTable(doc, {
        startY: yPos,
        head: [section.columns],
        body: section.data,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { top: 20, left: margin, right: margin },
      })
      yPos = doc.lastAutoTable.finalY + 10
    } else if (section.type === 'text') {
      doc.setFontSize(10)
      doc.setTextColor(80)
      const splitText = doc.splitTextToSize(section.content, pageWidth - margin * 2)
      doc.text(splitText, margin, yPos)
      yPos += splitText.length * 5 + 5
    }
  }

  // --- FOOTER ---
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} de ${pageCount} - ${enterprise?.name || 'Stockly'} - Confidentiel`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' },
    )
  }

  doc.save(fileName)
}
