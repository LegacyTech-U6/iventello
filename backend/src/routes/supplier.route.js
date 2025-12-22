const express = require("express");
const router = express.Router();
const  validateSupplier  = require("../middleware/validateSupllier"); 
const {
  deleteSupplier,
   createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  getProductsBySupplier,
} = require("../controller/suppliers.controller");
const getActiveEntreprise = require('../middleware/activeEntreprise');

// router.use(getActiveEntreprise);
router.get("/", getAllSuppliers);
router.post("/",validateSupplier, createSupplier);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);
router.get("/:id/products", getProductsBySupplier);

module.exports = router;
