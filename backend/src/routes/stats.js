const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/AuthenticatedUser");
const getActiveEntreprise = require("../middleware/activeEntreprise");

// 🌐 Tous les endpoints passent par les deux middlewares
// - authenticateUser : garantit que l'utilisateur est connecté
// - getActiveEntreprise : fournit req.entrepriseId si header X-Entreprise-Id présent
router.use(authenticateUser);
router.use(getActiveEntreprise);

// ----------------------------
// STATISTICS ROUTES
// ----------------------------
const statsController = require("../controller/statistics/productStats");
router.get("/sales", statsController.sales);
router.get("/profit", statsController.profit);
router.get("/clients", statsController.clients);
router.get("/products", statsController.topProducts);
router.get("/revenue-by-category", statsController.revenueByCategory);
router.get("/expenses", statsController.expenses);

module.exports = router;
