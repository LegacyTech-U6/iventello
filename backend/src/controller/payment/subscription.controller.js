const db = require("../../config/db");
const Subscription = db.Subscription;
const User = db.User;
const Plan = db.Plan;

// Créer un abonnement
exports.create = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).send(subscription);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Une erreur est survenue lors de la création de l'abonnement.",
    });
  }
};

// Récupérer tous les abonnements (Admin)
exports.findAll = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
        { model: Plan, as: "plan" },
      ],
    });
    res.send(subscriptions);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Une erreur est survenue lors de la récupération des abonnements.",
    });
  }
};

// Récupérer l'abonnement d'un utilisateur spécifique
exports.findByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const subscription = await Subscription.findOne({
      where: { user_id: userId },
      include: [{ model: Plan, as: "plan" }],
      order: [["createdAt", "DESC"]], // Le plus récent
    });
    if (!subscription) {
      return res
        .status(404)
        .send({ message: "Aucun abonnement trouvé pour cet utilisateur." });
    }
    res.send(subscription);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erreur lors de la récupération de l'abonnement." });
  }
};

// Mettre à jour un abonnement (ex: changement de plan, annulation)
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Subscription.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "L'abonnement a été mis à jour avec succès." });
    } else {
      res.send({
        message: `Impossible de mettre à jour l'abonnement avec l'id=${id}.`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        message:
          "Erreur lors de la mise à jour de l'abonnement avec l'id " + id,
      });
  }
};
