const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/AuthenticatedUser");
const adminController = require("../controller/statistics/adminStats.controller");

router.use(authenticateUser);

router.get("/dashboard", adminController.getDashboardStats);

module.exports = router;
