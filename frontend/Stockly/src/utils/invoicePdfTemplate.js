import html2pdf from 'html2pdf.js';

/**
 * Génère un PDF à partir d'un élément HTML
 * @param {string} elementId - L'ID de l'élément HTML à convertir
 * @param {string} fileName - Le nom du fichier de sortie
 */
export const exportToPDF = async (elementId, fileName = 'facture.pdf') => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`L'élément avec l'id #${elementId} est introuvable.`);
    return;
  }

  const options = {
    margin: [10, 10, 10, 10], // Marges [haut, gauche, bas, droite] en mm
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, // Augmente la résolution (2 = Retina/HD)
      useCORS: true, // Permet de charger des images externes
      letterRendering: true,
      logging: false 
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};