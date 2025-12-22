// backend/routes/entreprise.routes.js
const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const entrepriseController = require('../controller/entreprise.controller');
const authenticateUser = require('../middleware/AuthenticatedUser');

// Toutes les routes sont protégées : l'utilisateur doit être connecté
 router.use(authenticateUser);

// CRUD entreprises
router.post('/', upload.single("logo_url"), entrepriseController.createEntreprise);       // créer
router.get('/', entrepriseController.getAllEntreprises);          // lister toutes
router.get('/:uuid', entrepriseController.getEntrepriseByUuid);    // détails
router.put('/:uuid',upload.single("logo_url"), entrepriseController.updateEntreprise);     // mise à jour
router.delete('/:uuid', entrepriseController.deleteEntreprise);  // suppression

module.exports = router;
