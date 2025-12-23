// Utilisation de 'require' pour importer node-fetch (CommonJS)
const fetch = require('node-fetch');

/**
 * @description Génère un PDF à partir du HTML fourni en appelant un service externe.
 * Cette fonction est conçue pour être utilisée comme handler Express ou Cloud Function.
 * @param {object} req - Objet de requête (doit contenir req.body.html)
 * @param {object} res - Objet de réponse
 */
const generatePdf = async (req, res) => {
  console.log('=== Début generatePdf ===');

  try {
    const { html } = req.body;
    console.log('HTML reçu pour le PDF :', html?.substring(0, 200), '...'); // Log première partie du HTML

    if (!html) {
      console.warn('Aucun HTML fourni dans la requête');
      return res.status(400).json({ message: 'No HTML provided in request body' });
    }

    console.log('Appel au service PDF externe...');
    const pdfResponse = await fetch('https://invoiceapi-lfca.onrender.com/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    });

    console.log('Réponse du service PDF reçue, status:', pdfResponse.status);

    if (!pdfResponse.ok) {
      const text = await pdfResponse.text(); // Lire le corps pour debug
      console.error('Service PDF a échoué, corps de la réponse :', text);
      throw new Error(`PDF service failed with status: ${pdfResponse.status}`);
    }

    const buffer = await pdfResponse.arrayBuffer();
    console.log('PDF généré, taille du buffer :', buffer.byteLength);

    res.setHeader('Content-Type', 'application/pdf');
    console.log('Envoi du PDF au client...');
    res.send(Buffer.from(buffer));

    console.log('=== Fin generatePdf ===');
  } catch (error) {
    if (error.response && error.response.status === 502) {
        console.error("❌ Le service de génération PDF est indisponible (502).");
    } else {
        console.error("❌ Erreur PDF :", error.message);
    }
  }
};

// Export
module.exports = {
  generatePdf
};
