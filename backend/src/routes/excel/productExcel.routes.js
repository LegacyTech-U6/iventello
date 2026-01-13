const express = require('express');
const router = express.Router();

const {
  downloadProductTemplate,importProductsFromExcel
} = require('../../controller/excel/productExcel.controller');

const upload = require('../../middleware/uploadExcel.middleware');

const getActiveEntreprise = require("../../middleware/activeEntreprise");
router.use(getActiveEntreprise);
// Télécharger le template Excel Produits
router.get(
  '/products/template',
  downloadProductTemplate
);
 router.post(
  '/products/import',
  upload.single('file'),
  importProductsFromExcel
);


module.exports = router;
