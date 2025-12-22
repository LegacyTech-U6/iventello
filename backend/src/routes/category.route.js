const express = require("express");
const router = express.Router();
const {CategoryController, getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory} = require("../controller/category.controller");
const getActiveEntreprise = require('../middleware/activeEntreprise');
const authenticatedUser = require("../middleware/AuthenticatedUser");
 
router.use(authenticatedUser);
// 🔐 Middleware global : ajoute l’entreprise active dans req.entreprise
router.use(getActiveEntreprise);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id",deleteCategory);


module.exports = router;
