import html2pdf from 'html2pdf.js';

export const exportToPDF = async (target, fileName = 'facture.pdf') => {
  const originalElement = typeof target === 'string' ? document.getElementById(target) : target;

  if (!originalElement) {
    console.error("Élément introuvable");
    return;
  }

  // 1. Cloner l'élément pour le manipuler sans toucher l'interface utilisateur
  const clone = originalElement.cloneNode(true);

  // 2. Nettoyage du clone pour l'impression (CORRECTION DU RENDU FLOU)
  // On supprime les ombres et on force les dimensions A4
  clone.style.boxShadow = 'none'; // Supprime l'effet "capture d'écran"
  clone.style.margin = '0'; // Supprime les marges externes
  clone.style.width = '210mm'; // Largeur fixe A4
  clone.style.maxWidth = '210mm';
  clone.style.height = 'auto'; // Laisse le contenu définir la hauteur
  clone.style.minHeight = 'auto'; // Évite de forcer 297mm si le contenu est court
  
  // Correction des couleurs (HEX) pour éviter le bug oklch
  const allElements = clone.querySelectorAll('*');
  [clone, ...allElements].forEach(el => {
    el.style.fontFamily = 'Arial, sans-serif'; // Force une police standard propre
    const style = window.getComputedStyle(el);
    if (style.color.includes('oklch') || style.color.includes('rgba')) {
        // Force le noir pour le texte si douteux
       // el.style.color = '#000000'; 
    }
  });

  // 3. Créer un conteneur temporaire invisible
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // Conteneur largeur A4 stricte
  container.appendChild(clone);
  document.body.appendChild(container);

  // 4. Configuration optimisée
  const options = {
    // MARGE À 0 : On utilise le padding de ta div "p-8" comme marge visuelle.
    // Ça évite la page blanche en trop.
    margin: 0, 
    
    filename: fileName,
    image: { type: 'jpeg', quality: 1 }, // Qualité max
    html2canvas: { 
      scale: 2, // Meilleure résolution
      useCORS: true, 
      logging: false,
      scrollY: 0, // Important pour éviter les décalages verticaux
      windowWidth: 794 // Largeur exacte en pixels pour A4 (96 DPI)
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    // Petit délai pour le rendu
    await new Promise(r => setTimeout(r, 200));

    // Ouverture
    const pdfWindow = window.open("", "_blank");
    if(!pdfWindow) {
        alert("Pop-up bloqué. Veuillez autoriser les pop-ups.");
        return;
    }
    pdfWindow.document.write("Chargement de la facture...");

    const worker = html2pdf().set(options).from(clone);
    const pdfBlob = await worker.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    pdfWindow.location.href = blobUrl;
    
    // Nettoyage
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

  } catch (error) {
    console.error("Erreur PDF:", error);
  } finally {
    document.body.removeChild(container);
  }
};