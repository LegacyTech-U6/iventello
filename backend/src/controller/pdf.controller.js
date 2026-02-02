// Utilisation de 'require' pour importer node-fetch (CommonJS)
const fetch = require("node-fetch");

/**
 * @description Génère un PDF à partir du HTML fourni en appelant un service externe.
 * Cette fonction est conçue pour être utilisée comme handler Express ou Cloud Function.
 * @param {object} req - Objet de requête (doit contenir req.body.html)
 * @param {object} res - Objet de réponse
 */
const generatePdf = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      console.warn("Aucun HTML fourni dans la requête");
      return res
        .status(400)
        .json({ message: "No HTML provided in request body" });
    }

    const pdfResponse = await fetch(
      "https://invoiceapi-lfca.onrender.com/pdf",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      },
    );

    if (!pdfResponse.ok) {
      const text = await pdfResponse.text(); // Lire le corps pour debug
      console.error("Service PDF a échoué, corps de la réponse :", text);
      throw new Error(`PDF service failed with status: ${pdfResponse.status}`);
    }

    const buffer = await pdfResponse.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(buffer));
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
  generatePdf,
};
