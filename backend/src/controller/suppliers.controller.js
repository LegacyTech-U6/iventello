const sequelizeQuery = require('sequelize-query');
const db = require('../config/db'); // index.js avec tous les modèles
const Supplier = db.Supplier;
const Product = db.Product;
const queryParser = sequelizeQuery(db);

// ===============================
// 🔹 Récupérer tous les fournisseurs
// ===============================
exports.getAllSuppliers = async (req, res) => {
  try {
    const query = await queryParser.parse(req);

    // Filtrer par entreprise
    if (req.entrepriseId) {
      query.where = { ...query.where, entreprise_id: req.entrepriseId };
    }

    const data = await Supplier.findAll({
      ...query,
      attributes: { exclude: [] },
    });

    const count = await Supplier.count({
      where: query.where,
    });

    res.status(200).json({ count, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer un fournisseur par ID
// ===============================
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findOne({
      where: { id, entreprise_id: req.entrepriseId },
    });

    if (!supplier) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Créer un fournisseur
// ===============================
exports.createSupplier = async (req, res) => {
  try {
    const entrepriseId = req.entrepriseId;
    const supplierData = { ...req.body, entreprise_id: entrepriseId };
    const supplier = await Supplier.create(supplierData);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Mettre à jour un fournisseur
// ===============================
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const entrepriseId = req.entrepriseId;

    const [updated] = await Supplier.update(req.body, {
      where: { id, entreprise_id: entrepriseId },
    });

    if (!updated) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json({ message: 'Fournisseur mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Supprimer un fournisseur
// ===============================
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const entrepriseId = req.entrepriseId;

    const deleted = await Supplier.destroy({
      where: { id, entreprise_id: entrepriseId },
    });

    if (!deleted) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json({ message: 'Fournisseur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Produits d’un fournisseur
// ===============================
exports.getProductsBySupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findAll({
      where: { supplier: id, entreprise_id: req.entrepriseId },
      order: [['Prod_name', 'ASC']],
    });

    res.status(200).json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
