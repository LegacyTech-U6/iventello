const express = require("express");
const router = express.Router();
const activityController = require("../controller/activity.controller");
const reportSales = require("../controller/SalesReport.controller");
const purchaseReport = require("../controller/purchaseReport.controller")
// 🔐 Middleware pour vérifier l’entreprise active (comme pour les produits)
const getActiveEntreprise = require("../middleware/activeEntreprise");
router.use(getActiveEntreprise);

// 📜 Récupérer toutes les activités
router.get("/", activityController.getAllActivities);
router.get("/reports/daily-sales", reportSales.getDailySalesReport);
router.get("/reports/sales-report" , reportSales.getReport)
router.get("/reports/daily-purchases", purchaseReport.generateDailyPurchaseReport);
module.exports = router;
