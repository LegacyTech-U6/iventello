// backend/controllers/worker.controller.js
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db"); // ton index.js où tous les modèles sont importés
const Worker = db.Worker; // Sequelize model
const Entreprise = db.Entreprise;
const Role = db.roles;
const { Op } = require("sequelize");

const queryParser = sequelizeQuery(db);

exports.getAllWorkers = async (req, res) => {
  try {
    const query = await queryParser.parse(req);

    query.where = { ...(query.where || {}) };
    if (req.user?.id) {
      query.where.user_id = req.user.id;
    }

    console.log("Query where:", query.where);

    const data = await Worker.findAll({
      where: query.where,
      order: query.order || [["id", "ASC"]],
      limit: query.limit,
      offset: query.offset,
      include: [
        {
          model: Entreprise,
          as: "entreprise",
          attributes: ["id", "name", "description"],
        },
        { model: Role, as: "role", attributes: ["id", "name"] },
      ],
    });

    const count = await Worker.count({ where: query.where });

    res.status(200).json({ count, data });
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer un employé par ID
// ===============================
exports.getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findOne({
      where: { id },
      include: [
        { model: Entreprise, attributes: ["id", "name", "description"] },
        { model: Role, attributes: ["id", "name"] },
      ],
    });

    if (!worker) return res.status(404).json({ message: "Employé non trouvé" });

    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Créer un employé
// ===============================
exports.createWorker = async (req, res) => {
  console.log("Worker payload:", req.body);

  try {
    const { email } = req.body;

    const existingInAdmin = await db.User.findOne({ where: { email } });
    const existingInWorker = await Worker.findOne({ where: { email } });

    if (existingInAdmin || existingInWorker) {
      return res.status(400).json({
        message:
          "Cet email est déjà utilisé par un autre compte (admin ou employé).",
      });
    }

    const user_id = req.user.id;
    const workerData = { ...req.body, user_id };
    const worker = await Worker.create(workerData);

    // Récupérer le worker complet avec ses relations pour le frontend
    const fullWorker = await Worker.findByPk(worker.id, {
      include: [
        { model: db.roles, as: "role", attributes: ["id", "name"] },
        {
          model: db.Entreprise,
          as: "entreprise",
          attributes: ["id", "name", "uuid", "currency", "logo_url"],
        },
      ],
    });

    res.status(201).json(fullWorker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Mettre à jour un employé
// ===============================
exports.updateWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Worker.update(req.body, {
      where: { id },
    });

    if (!updated)
      return res.status(404).json({ message: "Employé non trouvé" });

    res.status(200).json({ message: "Employé mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Supprimer un employé
// ===============================
exports.deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Worker.destroy({
      where: { id },
    });

    if (!deleted)
      return res.status(404).json({ message: "Employé non trouvé" });

    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
