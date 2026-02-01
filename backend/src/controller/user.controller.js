// controllers/user.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Import des modèles Sequelize
const User = db.User;
const { sendMail } = require("../utils/mailer");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// 🔹 Créer un utilisateur (inscription)
// ===============================
exports.register = async (req, res) => {
  try {
    // Gérer les deux formats de payload
    let userData = req.body;

    // Si les données sont imbriquées dans une clé 'username'
    if (req.body.username && typeof req.body.username === "object") {
      userData = req.body.username;
    }

    const { username, Last_name, email, telephone, password } = userData;

    console.log("Payload register traité:", userData);
    const existingInAdmin = await User.findOne({ where: { email } });
    const existingInWorker = await db.Worker.findOne({ where: { email } });

    if (existingInAdmin || existingInWorker) {
      return res.status(400).json({
        message:
          "Cet email est déjà utilisé par un autre compte (admin ou employé).",
      });
    }

    // 2️⃣ Hacher le mot de passe (à remplacer par bcrypt)
    const password_hash = password; // TODO: bcrypt.hash(password, 10)

    // 3️⃣ Création du compte
    const newUser = await User.create({
      username,
      Last_name,
      email,
      telephone,
      password_hash,
      is_active: false,
    });

    // 4️⃣ Création du token d’activation
    const activationToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 5️⃣ Lien d’activation
    const activationLink = `${process.env.FRONTEND_URL}/verify/${activationToken}`;

    // 6️⃣ Préparer le mail

    const htmlContent = `
      <h2>Bienvenue, ${username} 👋</h2>
      <p>Merci de vous être inscrit sur <strong>Iventello</strong>.</p>
      <p>Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
      <a href="${activationLink}" 
         style="display:inline-block;background:#2563eb;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
        Activer mon compte
      </a>
      <p>Ce lien expire dans 24 heures.</p>
    `;

    // 7️⃣ Envoi du mail via Resend + logs détaillés
    // 7️⃣ Envoi du mail via Mailjet
    const mailResult = await sendMail({
      to: email,
      subject: "Activez votre compte Stockly",
      html: htmlContent,
    });

    console.log("Résultat envoi mail:", mailResult);

    if (!mailResult.success) {
      console.error(
        "⚠️ L'email d'activation n'a pas pu être envoyé:",
        mailResult.error,
      );
    }
    // 8️⃣ Réponse API
    res.status(201).json({
      message:
        "Utilisateur créé. Un email d’activation a été envoyé (voir logs pour debug).",
      mailLog: mailResult.response || null,
    });
  } catch (err) {
    console.error("❌ Erreur register:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Payload login:", req.body); // Log du payload

    // Vérifier si l'email et le mot de passe sont présents
    if (!email || !password) {
      console.log("Email ou mot de passe requis");
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // 1️⃣ Chercher l'utilisateur dans la vue all_users
    const [results] = await db.sequelize.query(
      `
      SELECT * FROM all_users
      WHERE email = :email
      LIMIT 1
      `,
      { replacements: { email } },
    );

    console.log("Résultat de la requête SQL:", results); // Log des résultats de la requête SQL

    // Si aucun utilisateur n'est trouvé
    if (!results || results.length === 0) {
      console.log("Cet email n'a pas de compte Iventello");
      return res
        .status(400)
        .json({ message: "Cet email n'a pas de compte Iventello" });
    }

    // On récupère l'utilisateur trouvé
    const userRecord = results[0];
    console.log("Utilisateur trouvé:", userRecord); // Log de l'utilisateur trouvé

    // 2️⃣ Vérifier le mot de passe
    const match = await bcrypt.compare(password, userRecord.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // 3️⃣ Récupérer les détails et vérifier le statut selon le type
    let userDetails;
    if (userRecord.type === "admin") {
      userDetails = await db.User.findByPk(userRecord.id, {
        attributes: ["id", "username", "email", "is_active"],
      });

      if (!userDetails.is_active) {
        return res.status(403).json({
          message:
            "Votre compte administrateur n'est pas encore activé. Veuillez vérifier vos emails.",
        });
      }
    } else if (userRecord.type === "worker") {
      userDetails = await db.Worker.findByPk(userRecord.id, {
        attributes: [
          "id",
          "name",
          "email",
          "position",
          "status",
          "entreprise_id",
          "role_id",
        ],
        include: [
          { model: db.roles, as: "role", attributes: ["id", "name"] },
          {
            model: db.Entreprise,
            as: "entreprise",
            attributes: [
              "id",
              "name",
              "uuid",
              "currency",
              "logo_url",
              "description",
              "adresse",
              "ville",
              "code_postal",
              "email_contact",
              "telephone_contact",
              "numero_fiscal",
              "nui",
              "informations_bancaires",
            ],
          },
        ],
      });

      if (!userDetails) {
        return res
          .status(404)
          .json({ message: "Détails de l'employé introuvables" });
      }

      if (userDetails.status !== "active") {
        const statusMsg =
          userDetails.status === "suspended" ? "suspendu" : "inactif";
        return res.status(403).json({
          message: `Votre compte est actuellement ${statusMsg}. Contactez votre administrateur.`,
        });
      }
    }

    // 4️⃣ Générer le token JWT
    const token = jwt.sign(
      { id: userRecord.id, email: userRecord.email, type: userRecord.type },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log("Token généré:", token); // Log du token généré

    // URL publique pour le logo si worker
    let finalUser = userDetails;
    if (
      userDetails &&
      userDetails.entreprise &&
      userDetails.entreprise.logo_url
    ) {
      finalUser = userDetails.toJSON ? userDetails.toJSON() : userDetails;
      finalUser.entreprise.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${finalUser.entreprise.logo_url}`;
    }

    // Réponse avec succès et le token généré
    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: finalUser,
    });
    console.log("Détails de l'utilisateur:", userDetails); // Log des détails de l'utilisateur
  } catch (err) {
    console.error("Erreur dans le processus de login:", err); // Log détaillé de l'erreur
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

// ===============================
// 🔹 Déconnexion (logout)
// ===============================
// Rien à supprimer côté serveur : le token est invalidé côté client.
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Mot de passe oublié
// ===============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email non trouvé" });

    // Générer un token de réinitialisation (15 min)
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // 💌 Normalement : envoi du lien par email
    // Exemple : https://tonsite.com/reset-password?token=xxxx
    // Ici on renvoie juste le token (pour dev)
    res.status(200).json({
      message: "Lien de réinitialisation généré (à envoyer par email)",
      resetToken,
    });
  } catch (err) {
    console.error("Erreur forgotPassword:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Réinitialiser le mot de passe
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res
        .status(400)
        .json({ message: "Token et nouveau mot de passe requis" });

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashed;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error("Erreur resetPassword:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Changer le mot de passe (auth requis)
// ===============================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match)
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur changePassword:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Mettre à jour le profil
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, telephone, Last_name } = req.body;

    // Vérifier les doublons
    const existing = await User.findOne({
      where: {
        email,
        id: { [db.Sequelize.Op.ne]: userId },
      },
    });

    if (existing)
      return res.status(400).json({ message: "Email déjà utilisé" });

    await User.update(
      { username, email, telephone, Last_name },
      { where: { id: userId } },
    );

    res.status(200).json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur updateProfile:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer le profil de l'utilisateur connecté
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const { id, type } = req.user; // type vient du token (admin ou worker)
    let profile;

    if (type === "admin") {
      profile = await db.User.findByPk(id, {
        attributes: [
          "id",
          "username",
          "email",
          "Last_name",
          "telephone",
          "created_at",
        ],
      });

      if (profile) {
        profile = {
          ...profile.toJSON(),
          type: "admin", // 🔹 on ajoute le type ici
        };
      }
    } else if (type === "worker") {
      profile = await db.Worker.findByPk(id, {
        attributes: [
          "id",
          "name",
          "email",
          "position",
          "status",
          "date_hired",
          "entreprise_id",
          "role_id",
        ],
        include: [
          { model: db.roles, as: "role", attributes: ["id", "name"] },
          {
            model: db.Entreprise,
            as: "entreprise",
            attributes: [
              "id",
              "name",
              "uuid",
              "currency",
              "logo_url",
              "description",
              "adresse",
              "ville",
              "code_postal",
              "email_contact",
              "telephone_contact",
              "numero_fiscal",
              "nui",
              "informations_bancaires",
            ],
          },
        ],
      });

      if (profile) {
        profile = {
          ...profile.toJSON(),
          type: "worker", // 🔹 on ajoute aussi ici
        };
      }
    }

    if (!profile)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    let finalProfile = profile.toJSON ? profile.toJSON() : profile;
    if (finalProfile.entreprise && finalProfile.entreprise.logo_url) {
      finalProfile.entreprise.logo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${finalProfile.entreprise.logo_url}`;
    }

    res.status(200).json(finalProfile);
  } catch (err) {
    console.error("Erreur getProfile:", err);
    res.status(500).json({ message: err.message });
  }
};

// =================================
// activation link message
// =================================
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.is_active = true;
    await user.save();

    res.status(200).json({ message: "Compte activé avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Lien d’activation invalide ou expiré" });
  }
};
