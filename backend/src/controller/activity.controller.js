const db = require("../config/db");

exports.getAllActivities = async (req, res) => {
  try {
    const entreprise_id = req.entrepriseId;
    console.log("====================================");
    console.log("Entreprise ID:", entreprise_id);
    console.log("====================================");

    // Récupère toutes les activités liées aux produits pour cette entreprise
    const activities = await db.activities.findAll({
      where: { entreprise_id, entity_type: "Product" },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "email"], // info admin
          required: false // ne pas exclure si null
        },
        {
          model: db.Worker,
          as: "worker",
          attributes: ["id", "name", "email"], // info worker
          required: false // ne pas exclure si null
        },
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "Prod_name"]
        }
      ]
    });

    // Détermine correctement qui a fait l'action
    const formattedActivities = activities.map(act => {
      let performer = null;
      if (act.user && act.user.id) performer = act.user;      // si admin
      else if (act.worker && act.worker.id) performer = act.worker; // si worker

      return {
        ...act.toJSON(),
        performed_by: performer
      };
    });

    console.log("Retrieved activities:", formattedActivities);

    res.status(200).json({
      success: true,
      count: formattedActivities.length,
      activities: formattedActivities
    });
  } catch (err) {
    console.error("🔥 Erreur getAllActivities:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
