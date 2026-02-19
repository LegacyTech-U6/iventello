const db = require("../../config/db");
const Plan = db.Plan;

// Créer un plan
exports.create = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).send(plan);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Une erreur est survenue lors de la création du plan.",
    });
  }
};

// Récupérer tous les plans
exports.findAll = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.send(plans);
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "Une erreur est survenue lors de la récupération des plans.",
    });
  }
};

// Récupérer un plan par ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res
        .status(404)
        .send({ message: "Plan non trouvé avec l'id " + id });
    }
    res.send(plan);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Erreur lors de la récupération du plan avec l'id " + id,
      });
  }
};

// Mettre à jour un plan
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Plan.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Le plan a été mis à jour avec succès." });
    } else {
      res.send({
        message: `Impossible de mettre à jour le plan avec l'id=${id}. Peut-être que le plan n'a pas été trouvé ou que le corps de la requête est vide !`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Erreur lors de la mise à jour du plan avec l'id " + id,
      });
  }
};

// Supprimer un plan
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Plan.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Le plan a été supprimé avec succès !" });
    } else {
      res.send({
        message: `Impossible de supprimer le plan avec l'id=${id}. Le plan n'a peut-être pas été trouvé !`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Impossible de supprimer le plan avec l'id " + id });
  }
};
