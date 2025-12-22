const express = require("express");
const router = express.Router();

// 🧩 Importation des contrôleurs et middlewares
const ProductController = require("../controller/products.controller");
const validateProduct = require("../middleware/validateProduct");
const upload = require("../middleware/upload");
const getActiveEntreprise = require("../middleware/activeEntreprise");
const authenticateUser = require('../middleware/AuthenticatedUser');

// 🔐 Middleware global : ajoute l’entreprise active dans req.entreprise
router.use(getActiveEntreprise);

/* ============================================================
   🧱 ROUTES PRODUITS
   Chaque route correspond à une action sur les produits.
   Multer (upload.single("prod_image")) est utilisé pour gérer
   le champ image envoyé depuis le frontend (FormData).
============================================================ */

// 🆕 Créer un produit (avec image optionnelle)
router.post(
  "/",
  authenticateUser,
  upload.single("Prod_image"),
  validateProduct,
  ProductController.createProduct
);

// 🧾 Obtenir tous les produits de l’entreprise active
router.get("/", ProductController.getAllProducts);

// ⚠️ Produits avec stock faible
router.get("/low-stock", ProductController.getLowStockProducts);

// ❌ Produits en rupture de stock
router.get("/out-of-stock", ProductController.getOutOfStockProducts);

// 💰 Statistiques de ventes par produit
router.get("/sales", ProductController.getSales);

// 📦 Obtenir un produit par son ID
router.get("/:id", ProductController.getProductById);

// 📂 Obtenir les produits d’une catégorie donnée
router.get("/category/:categoryId", ProductController.getProductsByCategory);

// 🛒 Achat d’un produit (réduction du stock)
router.post("/buy", ProductController.buyProduct);

// ➕ Ajouter un produit (autre endpoint si besoin)
router.post("/add",ProductController.addQuantity);

// ✏️ Mettre à jour un produit (avec ou sans nouvelle image)
router.put(
  "/:id",
  authenticateUser,
  upload.single("prod_image"),
  validateProduct,
  ProductController.updateProduct
);

// 🗑️ Supprimer un produit
router.delete("/:id", authenticateUser, ProductController.deleteProduct);

/* ============================================================
   🏁 Export du routeur
============================================================ */
module.exports = router;
