// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
} = require("../controller/facture.controller");
const getActiveEntreprise = require("../middleware/activeEntreprise");
const authenticateUser = require("../middleware/AuthenticatedUser");

router.use(authenticateUser);
// 🔐 Middleware global : ajoute l’entreprise active dans req.entreprise

router.use(getActiveEntreprise);

router.post("/", createInvoice); // Créer une facture
router.get("/", getAllInvoices); // Récupérer toutes les factures
router.get("/:id", getInvoiceById); // Récupérer une facture spécifique

module.exports = router;
