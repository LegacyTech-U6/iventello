// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const {
  getRecentNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controller/notification.controller");
const authenticateUser = require("../middleware/AuthenticatedUser");
const getActiveEntreprise = require("../middleware/activeEntreprise");

router.use(getActiveEntreprise);

router.get("/", authenticateUser, getRecentNotifications);
router.patch("/:id/read", authenticateUser, markAsRead);
router.patch("/read-all", authenticateUser, markAllAsRead);

module.exports = router;
