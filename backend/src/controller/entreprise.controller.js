require("dotenv").config();
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db");
const Entreprise = db.Entreprise;
const queryParser = sequelizeQuery(db);
const { supabase } = require("../middleware/supabase");

// ===============================
// 🔹 Récupérer toutes les entreprises d’un utilisateur
// ===============================
exports.getAllEntreprises = async (req, res) => {
  try {
    const query = await queryParser.parse(req);

    if (req.user && req.user.id) {
      query.where = { ...query.where, user_id: req.user.id };
    }

    const entreprises = await Entreprise.findAll({
      ...query,
      attributes: { exclude: [] },
    });

    const data = entreprises.map((p) => {
      const EntJSON = p.toJSON();
      if (EntJSON.logo_url) {
        // URL publique Supabase
        EntJSON.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${EntJSON.logo_url}`;
      }
      return EntJSON;
    });

    const count = await Entreprise.count({ where: query.where });

    res.status(200).json({ count, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer une entreprise par UUID
// ===============================
exports.getEntrepriseByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;

    const entreprise = await Entreprise.findOne({ where: { uuid } });
    if (!entreprise)
      return res.status(404).json({ message: "Entreprise non trouvée" });

    const entJSON = entreprise.toJSON();
    if (entJSON.logo_url) {
      entJSON.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${entJSON.logo_url}`;
    }

    res.status(200).json(entJSON);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Créer une entreprise
// ===============================
exports.createEntreprise = async (req, res) => {
  try {
    // 1️⃣ Vérifier l'utilisateur
    // 1️⃣ Vérifier l'utilisateur

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    const user_id = req.user.id;

    // 2️⃣ Vérifier le body reçu
    // 2️⃣ Vérifier le body reçu

    // 3️⃣ Vérifier le fichier uploadé
    let logoFileName = null;
    if (req.file) {
      const fileName = Date.now() + "-" + req.file.originalname;

      const { error } = await supabase.storage
        .from("images") // bucket public
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (error) {
        console.error("Erreur upload Supabase:", error);
        throw error;
      }

      logoFileName = fileName;
    } else {
    }

    // 4️⃣ Création en DB
    const entreprise = await Entreprise.create({
      ...req.body,
      user_id,
      logo_url: logoFileName,
    });

    // 5️⃣ Générer l'URL publique du logo
    const entJSON = entreprise.toJSON();
    if (logoFileName) {
      entJSON.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${logoFileName}`;
    }

    // 6️⃣ Réponse
    res.status(201).json(entJSON);
  } catch (err) {
    console.error("Erreur createEntreprise:", err);
    res.status(500).json({ message: err.message || "fetch failed" });
  } finally {
  }
};

// ===============================
// 🔹 Mettre à jour une entreprise par UUID
// ===============================
exports.updateEntreprise = async (req, res) => {
  try {
    const { uuid } = req.params;

    const entreprise = await Entreprise.findOne({ where: { uuid } });
    if (!entreprise)
      return res.status(404).json({ message: "Entreprise non trouvée" });

    // 🔹 Si une nouvelle image est uploadée
    if (req.file) {
      const fileName = Date.now() + "-" + req.file.originalname;

      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });
      if (error) throw error;

      // Supprimer l'ancienne image si elle existe
      if (entreprise.logo_url) {
        await supabase.storage.from("images").remove([entreprise.logo_url]);
      }

      req.body.logo_url = fileName;
    }

    await entreprise.update(req.body);

    const entJSON = entreprise.toJSON();
    if (entJSON.logo_url) {
      entJSON.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${entJSON.logo_url}`;
    }

    res
      .status(200)
      .json({
        message: "Entreprise mise à jour avec succès",
        entreprise: entJSON,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Supprimer une entreprise par UUID
// ===============================
exports.deleteEntreprise = async (req, res) => {
  try {
    const { uuid } = req.params;

    const entreprise = await Entreprise.findOne({ where: { uuid } });
    if (!entreprise)
      return res.status(404).json({ message: "Entreprise non trouvée" });

    // Supprimer le logo dans Supabase
    if (entreprise.logo_url) {
      await supabase.storage.from("images").remove([entreprise.logo_url]);
    }

    await entreprise.destroy();

    res.status(200).json({ message: "Entreprise supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
