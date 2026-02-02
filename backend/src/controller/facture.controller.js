// controllers/invoice.controller.js
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db");
const { Invoice, InvoiceItem, Product, Client, Entreprise, Sales } = db;
const logActivity = require("../utils/activityLogger");
const queryParser = sequelizeQuery(db);
const { sendNotification } = require("../utils/notification");

const InvoiceController = {
  // 🔹 Create an invoice (Without impacting stock/sales yet)
  async createInvoice(req, res) {
    try {
      const entreprise_id = req.entrepriseId;
      const {
        client_id,
        items = [],
        discount = 0,
        reduction_type,
        notes,
        mode_paiement,
        payment_method,
        date_echeance,
        tax = 0,
      } = req.body;

      let total_hors_reduction = 0;
      for (const item of items) {
        // Calculate item total cost: (Price * Qty) - Discount
        const itemTotal = Number(item.quantity) * Number(item.selling_price);
        const itemDiscount = Number(item.discount) || 0;
        total_hors_reduction += itemTotal - itemDiscount;
      }

      const general_total =
        total_hors_reduction - Number(discount) + Number(tax);
      const total = total_hors_reduction;

      const invoice = await Invoice.create({
        client_id,
        entreprise_id,
        total,
        discount,
        reduction_type,
        tax,
        general_total,
        notes,
        status: "en_attente",
        payment_method: payment_method || mode_paiement || "espece",
        date_echeance,
      });

      // ✅ Send notification for invoice creation
      await sendNotification({
        type: "invoice",
        message: `New invoice created (ID: ${invoice.id})`,
        user_id: req.user?.id,
      });

      for (const item of items) {
        await InvoiceItem.create({
          facture_id: invoice.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.selling_price,
          tva: item.tva || 0,
          discount: item.discount || 0,
        });
      }

      res.status(201).json(invoice);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  // 🔹 Update Invoice Status (Handle Stock & Sales on Payment)
  async updateStatus(req, res) {
    try {
      const entreprise_id = req.entrepriseId;
      const { id } = req.params;
      const { status } = req.body;

      const invoice = await Invoice.findOne({
        where: { id, entreprise_id },
        include: [{ model: InvoiceItem, as: "items" }],
      });

      if (!invoice)
        return res.status(404).json({ message: "Facture non trouvée" });

      if (invoice.status === "payée" && status === "payée") {
        return res.status(400).json({ message: "Facture déjà payée" });
      }

      // If transition to PAID -> Process Stock & Sales
      if (status === "payée" && invoice.status !== "payée") {
        const items = invoice.items;

        for (const item of items) {
          // Check & Update Stock
          const product = await Product.findOne({
            where: { id: item.product_id, entreprise_id },
          });

          if (!product)
            throw new Error(`Product not found: ${item.product_id}`);
          if (product.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for product: ${product.Prod_name}`,
            );
          }

          product.quantity -= item.quantity;
          await product.save();

          // Create Sale Record
          const itemDiscount = Number(item.discount) || 0;
          const finalItemTotal =
            Number(item.unit_price) * Number(item.quantity) - itemDiscount;

          await Sales.create({
            product_id: item.product_id,
            quantity_sold: item.quantity,
            total_price: finalItemTotal,
            total_profit:
              finalItemTotal -
              Number(product.cost_price) * Number(item.quantity),
            entreprise_id,
          });

          // Log Activity
          await logActivity({
            user: req.user,
            action: "Sale",
            entity_type: "Product",
            entity_id: product.id,
            description: `Sold ${item.quantity} units of "${product.Prod_name}" (Invoice #${invoice.id})`,
            quantity: item.quantity,
            amount: finalItemTotal,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            entreprise_id,
          });

          // Send Notification
          await sendNotification({
            type: "sale",
            message: `New sale: ${item.quantity} units of "${product.Prod_name}"`,
            user_id: req.user?.id,
          });
        }
      }

      // Update Status
      invoice.status = status;
      await invoice.save();

      res.status(200).json({ message: "Statut mis à jour", invoice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  async getAllInvoices(req, res) {
    try {
      const entreprise_id = req.entrepriseId;
      const query = await queryParser.parse(req);

      query.where = { ...query.where, entreprise_id };

      const data = await Invoice.findAll({
        ...query,
        include: [
          {
            model: Client,
            as: "client",
            attributes: ["id", "client_name", "email"],
          },
          {
            model: InvoiceItem,
            as: "items", // ✅ alias obligatoire ici
            include: [
              {
                model: Product,
                as: "product", // ✅ alias cohérent avec ton association
                attributes: ["id", "Prod_name"],
              },
            ],
          },
        ],
        order: [["id", "DESC"]],
      });

      const count = await Invoice.count({ where: query.where });

      res.status(200).json({ count, data });
    } catch (err) {
      console.error("🔥 Erreur getAllInvoices:", err);
      res.status(500).json({ message: err.message });
    }
  },
  // 🔹 Récupérer une facture par ID
  async getInvoiceById(req, res) {
    try {
      const entreprise_id = req.entrepriseId;
      const { id } = req.params;

      const invoice = await Invoice.findOne({
        where: { id, entreprise_id },
        include: [
          { model: Client, attributes: ["id", "client_name", "email"] },
          {
            model: InvoiceItem,
            include: [{ model: Product, attributes: ["id", "Prod_name"] }],
          },
        ],
      });

      if (!invoice)
        return res.status(404).json({ message: "Facture non trouvée" });

      res.status(200).json(invoice);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = InvoiceController;
