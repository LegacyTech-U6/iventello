const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
 
  deleteClient,
  getAllClients,
  getClientById,
  createClient,
  updateClient,
} = require("../controller/client.controller");
const authenticateUser = require("../middleware/AuthenticatedUser");
const getActiveEntreprise = require('../middleware/activeEntreprise');
router.use(authenticateUser)
router.use(getActiveEntreprise)
router.get("/", getAllClients);
router.post("/", upload.single("image"), createClient);
router.get("/:id", getClientById);
router.put("/:id",upload.single("image"), updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
