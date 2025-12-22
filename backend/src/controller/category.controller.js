// controllers/category.controller.js
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db"); // index.js où tous tes modèles sont importés
const { Category, Product } = db;
const { sendNotification } = require('../utils/notification');

const queryParser = sequelizeQuery(db);

// 🔹 Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const query = await queryParser.parse(req);

    // Filtrer automatiquement sur l'entreprise
    if (req.user || req.entrepriseId) {
      query.where = { ...query.where, entreprise_id: req.entrepriseId };
    }

    const data = await Category.findAll({
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Products" AS p
              WHERE p.category_id = "Category".id
            )`),
            "productCount",
          ],
        ],
      },
      ...query,
    });

    const count = await Category.count({
      where: query.where,
    });

    res.status(200).json({ count, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Récupérer une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, entreprise_id: req.entrepriseId },
      attributes: {
        include: [
          [
            db.sequelize.fn("COUNT", db.sequelize.col("products.id")),
            "productCount",
          ],
        ],
      },
      include: [{ model: Product, as: "products", attributes: [] }],
      group: ["Category.id"],
    });

    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Créer une catégorie
exports.createCategory = async (req, res) => {
  try {
    const entreprise_id = req.entrepriseId;
    const { name, description } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ message: "Le nom de la catégorie est requis" });

    const category = await Category.create({
      name,
      description,
      entreprise_id,
    });

    // ✅ Envoyer notification
    await sendNotification({
      type: 'category',
      message: `New category created : ${category.name}`,
      user_id: req.user?.id,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId;
    const { name, description } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ message: "Le nom de la catégorie est requis" });

    const [updated] = await Category.update(
      { name, description },
      { where: { id, entreprise_id } }
    );

    if (!updated)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    // ✅ Envoyer notification
    await sendNotification({
      type: 'category',
      message: `Category updated : ${name}`,
      user_id: req.user?.id,
    });

    res.status(200).json({ message: "Catégorie mise à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId;

    const deleted = await Category.destroy({ where: { id, entreprise_id } });

    if (!deleted)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    // ✅ Envoyer notification
    await sendNotification({
      type: 'category',
      message: `Category deleted (ID: ${id})`,
      user_id: req.user?.id,
    });

    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
