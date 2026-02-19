const express = require("express");
const router = express.Router();
const planController = require("../../controller/payment/plan.controller");

// Créer un nouveau plan
router.post("/", planController.create);

// Récupérer tous les plans
router.get("/", planController.findAll);

// Récupérer un seul plan par id
router.get("/:id", planController.findOne);

// Mettre à jour un plan par id
router.put("/:id", planController.update);

// Supprimer un plan par id
router.delete("/:id", planController.delete);

module.exports = router;
