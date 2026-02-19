const express = require("express");
const router = express.Router();
const subscriptionController = require("../../controller/payment/subscription.controller");

// Créer un nouvel abonnement
router.post("/", subscriptionController.create);

// Récupérer tous les abonnements
router.get("/", subscriptionController.findAll);

// Récupérer l'abonnement d'un utilisateur
router.get("/user/:userId", subscriptionController.findByUser);

// Mettre à jour un abonnement
router.put("/:id", subscriptionController.update);

module.exports = router;
