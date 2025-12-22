// routes/pythonpdfRoute.js
const  express = require("express");
const  { generatePdf } = require ("../controller/pdf.controller"); // <-- vérifier extension .js

const router = express.Router();

router.post("/from-python", generatePdf);

module.exports = router;
