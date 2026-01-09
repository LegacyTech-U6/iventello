const ExcelJS = require('exceljs');
const db = require("../../config/db");

const Category = db.Category;
const Supplier = db.Supplier;
const Product = db.Product;

exports.generateProductTemplate = async (entreprise_id) => {
  const workbook = new ExcelJS.Workbook();

  /**
   * =========================
   * FEUILLE PRINCIPALE : PRODUITS
   * =========================
   */
  // Ajout de 'views' pour figer l'en-tête en haut lors du scroll
  const sheet = workbook.addWorksheet('Produits', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  sheet.columns = [
    { header: 'Nom du produit *', key: 'prod_name', width: 30 },
    { header: 'Prix de vente *', key: 'selling_price', width: 15, style: { numFmt: '#,##0.00' } },
    { header: 'Prix d’achat *', key: 'cost_price', width: 15, style: { numFmt: '#,##0.00' } },
    { header: 'Quantité', key: 'quantity', width: 12 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Code barre', key: 'code_bar', width: 20 },
    { header: 'Date arrivée', key: 'date_of_arrival', width: 15 },
    { header: 'Stock min', key: 'min_stock_level', width: 15 },
    { header: 'Stock max', key: 'max_stock_level', width: 15 },
    { header: 'Catégorie', key: 'category', width: 25 },
    { header: 'Fournisseur', key: 'supplier', width: 25 },
  ];

  // --- STYLE DE L'EN-TÊTE ---
  const headerRow = sheet.getRow(1);
  headerRow.height = 25; // Plus haut pour plus de clarté
  
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C3E50' } // Bleu nuit pro
    };
    cell.font = {
      name: 'Arial',
      color: { argb: 'FFFFFFFF' }, // Texte blanc
      bold: true,
      size: 11
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF000000' } }
    };
  });

  const startRow = 2;
  const endRow = 5000;

  // VALIDATIONS (Inchangées)
  sheet.dataValidations.add(`A${startRow}:A${endRow}`, {
    type: 'textLength',
    operator: 'greaterThan',
    formulae: [0],
    showErrorMessage: true,
    error: 'Le nom du produit est obligatoire',
  });

  sheet.dataValidations.add(`B${startRow}:B${endRow}`, {
    type: 'decimal',
    operator: 'greaterThanOrEqual',
    formulae: [0],
    error: 'Prix de vente >= 0',
  });

  sheet.dataValidations.add(`C${startRow}:C${endRow}`, {
    type: 'decimal',
    operator: 'greaterThanOrEqual',
    formulae: [0],
    error: 'Prix d’achat >= 0',
  });

  sheet.dataValidations.add(`D${startRow}:D${endRow}`, {
    type: 'whole',
    operator: 'greaterThanOrEqual',
    formulae: [0],
    error: 'Quantité >= 0',
  });

  sheet.dataValidations.add(`H${startRow}:H${endRow}`, {
    type: 'whole',
    operator: 'greaterThanOrEqual',
    formulae: [0],
    error: 'Stock min >= 0',
  });

  sheet.dataValidations.add(`I${startRow}:I${endRow}`, {
    type: 'whole',
    operator: 'greaterThanOrEqual',
    formulae: [0],
    error: 'Stock max >= 0',
  });

  sheet.dataValidations.add(`G${startRow}:G${endRow}`, {
    type: 'date',
    error: 'Date invalide (YYYY-MM-DD)',
  });

  /**
   * =========================
   * FEUILLE : LISTS (DB) pour dropdowns
   * =========================
   */
  const listSheet = workbook.addWorksheet('Lists');
  listSheet.state = 'veryHidden';

  const categories = await Category.findAll({
    where: { entreprise_id },
    order: [['name', 'ASC']],
  });

  const suppliers = await Supplier.findAll({
    where: { entreprise_id },
    order: [['supplier_name', 'ASC']],
  });

  listSheet.getCell('A1').value = 'Categories';
  listSheet.getCell('B1').value = 'Suppliers';

  categories.forEach((cat, i) => {
    listSheet.getCell(`A${i + 2}`).value = cat.name;
  });

  suppliers.forEach((sup, i) => {
    listSheet.getCell(`B${i + 2}`).value = sup.supplier_name;
  });

  sheet.dataValidations.add(`J${startRow}:J${endRow}`, {
    type: 'list',
    allowBlank: true,
    formulae: [`=Lists!$A$2:$A$${categories.length + 1}`],
    error: 'Choisissez une catégorie valide',
  });

  sheet.dataValidations.add(`K${startRow}:K${endRow}`, {
    type: 'list',
    allowBlank: true,
    formulae: [`=Lists!$B$2:$B$${suppliers.length + 1}`],
    error: 'Choisissez un fournisseur valide',
  });

  /**
   * =========================
   * REMPLISSAGE : PRODUITS EXISTANTS
   * =========================
   */
  const products = await Product.findAll({
    where: { entreprise_id },
    include: [
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Supplier, as: 'supplierInfo', attributes: ['supplier_name'] },
    ],
  });

  products.forEach((p) => {
    sheet.addRow({
      prod_name: p.Prod_name,
      selling_price: p.selling_price,
      cost_price: p.cost_price,
      quantity: p.quantity,
      description: p.description,
      code_bar: p.code_bar,
      date_of_arrival: p.date_of_arrival,
      min_stock_level: p.min_stock_level,
      max_stock_level: p.max_stock_level,
      category: p.category ? p.category.name : '',
      supplier: p.supplierInfo ? p.supplierInfo.supplier_name : '',
    });
  });

  /**
   * =========================
   * FEUILLE : INSTRUCTIONS (Amélioration visuelle)
   * =========================
   */
  const infoSheet = workbook.addWorksheet('Instructions');
  infoSheet.getColumn(1).width = 60;

  const instructions = [
    ['CONSIGNES D\'UTILISATION'],
    [''],
    ['⚠️ Ne modifiez pas les en-têtes (ligne 1)'],
    ['• Une ligne correspond à un seul produit'],
    ['• Les champs avec (*) sont obligatoires'],
    ['• Les prix et quantités doivent être supérieurs ou égaux à 0'],
    ['• Les dates doivent respecter le format : AAAA-MM-JJ'],
    ['• Utilisez les listes déroulantes pour les Catégories et Fournisseurs'],
    ['• Les produits existants seront mis à jour automatiquement'],
  ];

  infoSheet.addRows(instructions);
  infoSheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFC0392B' } };

  return workbook;
};