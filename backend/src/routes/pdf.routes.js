// routes/pythonpdfRoute.js
const  express = require("express");
const  { createPDFFromFlask } = require ("../controller/pdf.controller"); // <-- vérifier extension .js

const router = express.Router();

router.post("/from-python", createPDFFromFlask);

export default router;
