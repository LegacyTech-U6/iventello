// routes/purchaseRoutes.js
const express = require("express");;
const { createPurchase } =require( '../controller/purchase.controller');
const getActiveEntreprise = require("../middleware/activeEntreprise");

const router = express.Router();

router.post('/', getActiveEntreprise, createPurchase);

module.exports = router;
