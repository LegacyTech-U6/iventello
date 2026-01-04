const {
  generateProductTemplate,
} = require('../../utils/excel/productExcel.service');
const { importProducts } = require('../../utils/excel/productExcelUpload.service');

exports.downloadProductTemplate = async (req, res) => {
  try {
    const entreprise_id = req.headers['x-entreprise-id']; // récup depuis le header
    if (!entreprise_id) return res.status(400).json({ message: "X-Entreprise-Id manquant" });

    const workbook = await generateProductTemplate(entreprise_id);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="product-template.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la génération du template" });
  }
};



exports.importProductsFromExcel = async (req, res) => {
  try {
        const entreprise_id = req.headers['x-entreprise-id']; // récup depuis le header

    if (!req.file) {
      return res.status(400).json({ message: 'Fichier manquant' });
    }

    // req.user contient entreprise_id et user_id
    const result = await importProducts(req.file.buffer, entreprise_id ,req.user);

    res.status(200).json({
      message: 'Import terminé',
      summary: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

