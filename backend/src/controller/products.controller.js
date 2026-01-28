const sequelizeQuery = require("sequelize-query");
const db = require("../config/db"); // ton index.js où tu as tous tes modèles
const { Op, fn, col } = require("sequelize");
require("dotenv").config();
const Product = db.Product;
const Category = db.Category;
const Supplier = db.Supplier;
const Settings = db.Setting;
const Entreprise = db.Entreprise;
const Sales = db.Sales;
const fs = require("fs");
const path = require("path");
const queryParser = sequelizeQuery(db);
const BASE_URL = process.env.BASE_URL;
const logActivity = require("../utils/activityLogger");
const { sendNotification } = require("../utils/notification");
const { supabase } = require("../middleware/supabase");

// Helper pour vérifier les alertes de stock
const checkStockAlerts = async (product, entrepriseId) => {
  try {
    if (product.quantity === 0) {
      await sendNotification({
        type: "stock",
        message: `Rupture de stock : "${product.Prod_name}" est épuisé !`,
        entreprise_id: entrepriseId,
      });
    } else {
      const settings = await Settings.findOne({
        where: { entreprise_id: entrepriseId },
      });
      const threshold = settings?.stock_alert_threshold || 5;

      if (product.quantity <= threshold) {
        await sendNotification({
          type: "stock",
          message: `Stock faible : "${product.Prod_name}" (${product.quantity} restants)`,
          entreprise_id: entrepriseId,
        });
      }
    }
  } catch (error) {
    console.error("Erreur checkStockAlerts:", error);
  }
};

// ===============================
// 🔹 Récupérer tous les produits
// ===============================
exports.getAllProducts = async (req, res) => {
  console.log("GET /api/products called");

  try {
    const query = await queryParser.parse(req);

    if (req.user || req.entrepriseId) {
      query.where = { ...query.where, entreprise_id: req.entrepriseId };
    }

    const products = await Product.findAll({
      ...query,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Supplier,
          as: "supplierInfo",
          attributes: ["id", "supplier_name"],
        },
      ],
    });
    console.log(products[0]);

    const data = products.map((p) => {
      const prodJSON = p.toJSON();
      if (prodJSON.Prod_image) {
        // Ajouter l'URL complète publique de Supabase
        prodJSON.Prod_image = `${prodJSON.Prod_image}`;
      }
      return prodJSON;
    });

    const count = await Product.count({ where: query.where });

    res.status(200).json({ count, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Récupérer un produit par ID
// ===============================
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Product.findOne({
      where: { id, entreprise_id: req.entrepriseId },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Supplier,
          as: "supplierInfo",
          attributes: ["id", "supplier_name"],
        },
      ],
    });

    if (!data) return res.status(404).json({ message: "Produit non trouvé" });

    const product = data.toJSON();
    if (product.Prod_image) {
      // URL publique Supabase
      product.Prod_image = `${product.Prod_image}`;
    }
    console.log(product);

    res.status(200).json(product);
  } catch (err) {
    console.error("🔥 Erreur dans getProductById:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Create a product (with image & category check)
exports.createProduct = async (req, res) => {
  try {
    const entreprise_id = req.entrepriseId;
    const user_id = req.user?.id || null;
    const { category_id } = req.body;
    const Category = db.Category;

    // 🔹 Vérifier la catégorie
    if (category_id) {
      const category = await Category.findOne({
        where: { id: category_id, entreprise_id },
      });
      if (!category) {
        return res.status(400).json({
          message: "La catégorie spécifiée n'existe pas pour cette entreprise.",
        });
      }
    }

    // 🔹 Si une image est uploadée, envoyer vers Supabase
    let Prod_image = null;

    if (req.file) {
      console.log("📸 FICHIER REÇU :", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      const fileName = `${Date.now()}-${req.file.originalname}`;
      console.log("📝 Nom généré pour Supabase :", fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;
      console.log("📡 Résultat upload :", uploadData);

      // 🔹 Générer l’URL publique directement
      Prod_image = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
      console.log("🌍 URL publique générée :", Prod_image);
    } else {
      console.log("⚠️ Aucun fichier reçu → pas d’upload.");
    }

    // 🔹 Créer le produit avec l'URL publique
    const productData = {
      ...req.body,
      entreprise_id,
      user_id,
      Prod_image,
    };

    const product = await Product.create(productData);

    // 🔹 Log activity
    await logActivity({
      user: req.user || null,
      action: "Create Product",
      entity_type: "Product",
      entity_id: product.id,
      description: `Created product "${product.Prod_name}"`,
      quantity: product.quantity || 0,
      amount: product.selling_price || 0,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      entreprise_id,
    });

    // 🔹 Send notification
    await sendNotification({
      type: "product",
      message: `New product created: "${product.Prod_name}"`,
      user_id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("🔥 createProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Update a product
// ===============================

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId;

    const product = await Product.findOne({
      where: { id, entreprise_id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      // 🔹 Upload nouvelle image vers Supabase
      const fileName = Date.now() + "-" + req.file.originalname;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      // 🔹 Mettre à jour le nom du fichier dans la DB
      req.body.Prod_image = fileName;

      // 🔹 Supprimer l'ancienne image dans Supabase si elle existe
      if (product.Prod_image) {
        await supabase.storage.from("images").remove([product.Prod_image]);
      }
    }

    await product.update(req.body);

    // ✅ Send notification
    await sendNotification({
      type: "product",
      message: `Product updated: ${product.Prod_name}`,
      user_id: req.user?.id,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("🔥 updateProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Delete a product
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const entreprise_id = req.entrepriseId;

    const product = await Product.findOne({
      where: { id, entreprise_id },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.destroy({ where: { id, entreprise_id } });

    // ✅ Send notification
    await sendNotification({
      type: "product",
      message: `Product deleted: ${product.Prod_name}`,
      user_id: req.user?.id,
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Create a sale
// ===============================
exports.createSale = async (req, res) => {
  try {
    const { productId, quantitySold, totalPrice } = req.body;
    const entreprise_id = req.entrepriseId;

    const product = await Product.findOne({
      where: { id: productId, entreprise_id },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const total_profit =
      (product.selling_price - product.cost_price) * quantitySold;

    const sale = await Sales.create({
      product_id: productId,
      quantity_sold: quantitySold,
      total_price: totalPrice,
      total_profit,
      entreprise_id,
    });

    await logActivity({
      user_id: req.user.id,
      action: "Sale",
      entity_type: "Product",
      entity_id: product.id,
      description: `Sold ${quantitySold} units of "${product.Prod_name}"`,
      quantity: quantitySold,
      amount: quantitySold * product.selling_price,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      entreprise_id,
    });

    // 🔹 Update stock
    product.quantity -= quantitySold;
    await product.save();

    // ✅ Send notifications
    await sendNotification({
      type: "sale",
      message: `New sale: ${quantitySold} units of "${product.Prod_name}"`,
      user_id: req.user?.id,
    });

    await checkStockAlerts(product, entreprise_id);

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===============================
// 🔹 Ajouter de la quantité
// ===============================

exports.addQuantity = async (req, res) => {
  console.log("====================================");
  console.log("add product called");
  console.log("====================================");

  const { productId, quantityAdd } = req.body;
  const entrepriseId = req.entrepriseId;

  console.log("====================================");
  console.log(req.body);
  console.log("====================================");

  const MAX_RETRIES = 3; // nombre de tentatives si lock timeout
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    const t = await db.sequelize.transaction();
    try {
      // 🔹 1. Vérifier que le produit existe avec lock
      const product = await db.Product.findOne({
        where: { id: productId, entreprise_id: entrepriseId },
        transaction: t,
        lock: true, // SELECT ... FOR UPDATE
      });

      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Produit non trouvé",
        });
      }

      // 🔹 2. Mettre à jour la quantité
      product.quantity += Number(quantityAdd);
      await product.save({ transaction: t });

      await t.commit();
      console.log("✅ Quantité mise à jour avec succès");

      // 🔹 3. Enregistrer le log d’activité hors transaction
      const entreprise = await db.Entreprise.findByPk(entrepriseId);
      const user_id = req.user?.id || null;

      await logActivity({
        user_id,
        action: "Achat",
        entity_type: "Product",
        entity_id: product.id,
        description: `Achat de ${quantityAdd} unités de "${product.Prod_name}"`,
        quantity: quantityAdd,
        amount: quantityAdd * product.cost_price,
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        entreprise_id: entrepriseId,
      });

      return res.status(200).json({
        success: true,
        message: "Quantité ajoutée avec succès",
        product,
      });
    } catch (err) {
      await t.rollback();

      if (err.code === "ER_LOCK_WAIT_TIMEOUT") {
        attempt++;
        console.log(`⚠️ Lock timeout, tentative ${attempt}... retrying`);
        await new Promise((r) => setTimeout(r, 100 * attempt)); // wait avant retry
      } else {
        console.error("🔥 Transaction échouée :", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    }
  }

  // Si toutes les tentatives échouent
  return res.status(500).json({
    success: false,
    message: "Impossible d'ajouter la quantité, lock timeout répété",
  });
};

// ===============================
// 🔹 Acheter un produit (vente)
// ===============================
exports.buyProduct = async (req, res) => {
  try {
    const { productId, quantitySold } = req.body;
    const entrepriseId = req.entrepriseId;

    const product = await Product.findOne({
      where: { id: productId, entreprise_id: entrepriseId },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Produit non trouvé" });
    if (product.quantity < quantitySold)
      return res
        .status(400)
        .json({ success: false, message: "Stock insuffisant" });

    product.quantity -= quantitySold;
    await product.save();

    // ici tu peux créer une vente si tu as le modèle Sale
    if (db.Sale) {
      await db.Sale.create({
        product_id: productId,
        quantity_sold: quantitySold,
        total_price: product.selling_price * quantitySold,
        total_profit:
          (product.selling_price - product.cost_price) * quantitySold,
        entreprise_id: entrepriseId,
      });
    }
    // Logger la vente
    await logActivity({
      user_id: req.user.id,
      action: "Vente",
      entity_type: "Product",
      entity_id: product.id,
      description: `Vente de ${quantitySold} unités de "${product.Prod_name}"`,
      quantity: quantitySold,
      amount: quantitySold * product.selling_price,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      entreprise_id: entrepriseId,
    });

    await checkStockAlerts(product, entrepriseId);

    res
      .status(200)
      .json({ success: true, message: "Vente enregistrée", product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// 🔹 Produits en stock faible
// ===============================
exports.getLowStockProducts = async (req, res) => {
  try {
    const entrepriseId = req.entrepriseId;
    console.log(entrepriseId);

    const settings = await Settings.findOne({
      where: { entreprise_id: entrepriseId },
    });
    const threshold = settings?.stock_alert_threshold || 5;

    const products = await Product.findAll({
      where: { entreprise_id: entrepriseId, quantity: { [Op.lte]: threshold } },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Supplier,
          as: "supplierInfo",
          attributes: ["id", "supplier_name"],
        },
      ],
    });

    // Transformer le nom du fichier en URL publique Supabase
    const data = products.map((p) => {
      const prodJSON = p.toJSON();
      if (prodJSON.Prod_image) {
        prodJSON.Prod_image = `${prodJSON.Prod_image}`;
      }
      return prodJSON;
    });

    console.log("====================================");
    console.log(data);
    console.log("====================================");

    if (products.length > 0) {
      await sendNotification({
        type: "stock",
        message: `Alerte : ${products.length} produits sont actuellement en stock faible.`,
        entreprise_id: entrepriseId,
        user_id: req.user?.id,
        save: true,
      });
    }

    res.json({ threshold, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Produits en rupture de stock
// ===============================
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const entrepriseId = req.user.entreprise_id;

    const products = await Product.findAll({
      where: { entreprise_id: entrepriseId, quantity: 0 },
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Supplier, attributes: ["id", "supplier_name"] },
      ],
    });
    // Transformer le nom du fichier en URL publique Supabase
    const data = products.map((p) => {
      const prodJSON = p.toJSON();
      if (prodJSON.Prod_image) {
        prodJSON.Prod_image = `${prodJSON.Prod_image}`;
      }
      return prodJSON;
    });

    if (products.length > 0) {
      await sendNotification({
        type: "stock",
        message: `Rappel : ${products.length} produits sont en rupture de stock.`,
        entreprise_id: req.entrepriseId,
        user_id: req.user?.id,
        save: true,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 🔹 Produits par catégorie
// ===============================
exports.getProductsByCategory = async (req, res) => {
  console.log("====================================");
  console.log("products by category called");
  console.log("====================================");
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId))
      return res
        .status(400)
        .json({ success: false, message: "ID de catégorie invalide" });
    console.log("====================================");
    console.log("this is the category id received", categoryId);
    console.log("====================================");

    const data = await Product.findAll({
      where: {
        category_id: categoryId,
        entreprise_id: req.entrepriseId,
      },
      include: [
        { model: Category, as: "category", attributes: ["name"] }, // alias exact
        {
          model: Supplier,
          as: "supplierInfo",
          attributes: ["supplier_name", "email", "whatsapp_number"],
        },
      ],
      order: [["Prod_name", "ASC"]],
    });
    const count = await Product.count({
      where: {
        category_id: categoryId,
        entreprise_id: req.entrepriseId,
      },
    });
    // Transformer le nom du fichier en URL publique Supabase
    const products = products.map((p) => {
      const prodJSON = p.toJSON();
      if (prodJSON.Prod_image) {
        prodJSON.Prod_image = `${prodJSON.Prod_image}`;
      }
      return prodJSON;
    });
    console.log("====================================");
    console.log(count);
    console.log("====================================");

    res.status(200).json({ count, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// 🔹 Récupérer toutes les ventes
// ===============================
exports.getSales = async (req, res) => {
  try {
    const query = await queryParser.parse(req);

    // Filtrer par entreprise
    query.where = { ...query.where, entreprise_id: req.entrepriseId };

    const sales = await Sale.findAll({
      ...query,
      include: [{ model: Product, attributes: ["Prod_name", "selling_price"] }],
      order: [["createdAt", "DESC"]],
    });

    const count = await Sale.count({
      where: query.where,
    });

    res.status(200).json({ success: true, count, sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
