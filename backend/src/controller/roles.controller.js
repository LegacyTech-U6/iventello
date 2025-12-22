// controllers/role.controller.js
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db"); // ton index.js avec tous les modèles
const Role = db.roles;

const queryParser = sequelizeQuery(db);



// ===============================
// 🔹 Récupérer tous les rôles
// ===============================
exports.getAllRoles = async (req, res) => {
  try {
   
    const query = await queryParser.parse(req);
    const data = await Role.findAll({ ...query });
    const count = await Role.count({ where: query.where });
    
    res.json({ count, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer un rôle par ID
// ===============================
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rôle non trouvé" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Créer, mettre à jour, supprimer restent inchangés
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Le nom du rôle est requis" });
    const role = await Role.create({ name, description });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Role.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: "Rôle non trouvé" });
    res.json({ message: "Rôle mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Rôle non trouvé" });
    res.json({ message: "Rôle supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
