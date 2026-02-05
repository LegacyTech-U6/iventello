const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/AuthenticatedUser");
const reportsController = require("../controller/reports/reports.controller");
const getActiveEntreprise = require("../middleware/activeEntreprise");

// Middleware global : ajoute l’entreprise active dans req.entreprise
router.use(getActiveEntreprise);
router.use(authenticateUser);

router.get("/summary", reportsController.getReportSummary);
router.get("/sales-by-category", reportsController.getSalesByCategory);
router.get("/expenses", reportsController.getExpenses);
router.get("/profits", reportsController.getProfits);
router.get("/best-selling-product", reportsController.getBestSellingProduct);
router.get("/discounts", reportsController.getDiscounts);
router.get("/table", reportsController.getReportTable);

module.exports = router;
