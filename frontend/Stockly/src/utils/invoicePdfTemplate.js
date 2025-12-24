import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, fileName = 'document.pdf') => {
  const input = document.getElementById(elementId);
  
  if (!input) {
    console.error("L'élément HTML n'a pas été trouvé");
    return;
  }

  try {
    // 1. Capture du HTML en image haute résolution
    const canvas = await html2canvas(input, {
      scale: 2, // Augmente la qualité du texte
      useCORS: true, // Pour charger les images externes si besoin
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    // 2. Configuration du format PDF (A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 3. Ajout de l'image au PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // 4. Téléchargement
    pdf.save(fileName);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
  }
};