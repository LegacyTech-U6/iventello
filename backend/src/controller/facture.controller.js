// controllers/invoice.controller.js
const sequelizeQuery = require("sequelize-query");
const db = require("../config/db");
const { Invoice, InvoiceItem, Product, Client, Entreprise, Sales } = db;
const logActivity = require("../utils/activityLogger");
const queryParser = sequelizeQuery(db);
const { sendNotification } = require("../utils/notification");

const InvoiceController = {
  // 🔹 Create an invoice
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
        date_echeance,
        tax = 0,
      } = req.body;

      let total_hors_reduction = 0;
      for (const item of items) {
        total_hors_reduction +=
          Number(item.quantity) * Number(item.selling_price);
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
        mode_paiement,
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
          tva: item.vat || 0,
          discount: item.discount || 0,
        });

        // Update stock and create sale
        const product = await Product.findOne({
          where: { id: item.id, entreprise_id },
        });
        if (!product) throw new Error(`Product not found: ${item.id}`);

        product.quantity -= item.quantity;
        await product.save();

        const sale = await Sales.create({
          product_id: item.id,
          quantity_sold: item.quantity,
          total_price: item.selling_price * item.quantity,
          total_profit:
            (item.selling_price - product.cost_price) * item.quantity,
          entreprise_id,
        });

        const entreprise = await Entreprise.findByPk(entreprise_id);
        const user_id = req.user?.id || null;

        // Log the sale activity
        await logActivity({
          user: req.user,
          action: "Sale",
          entity_type: "Product",
          entity_id: product.id,
          description: `Sold ${item.quantity} units of "${product.Prod_name}"`,
          quantity: item.quantity,
          amount: item.quantity * item.selling_price,
          ip_address: req.ip,
          user_agent: req.headers["user-agent"],
          entreprise_id,
        });

        // ✅ Send notification for sale
        await sendNotification({
          type: "sale",
          message: `New sale: ${item.quantity} units of "${product.Prod_name}"`,
          user_id,
        });
      }

      res.status(201).json(invoice);
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
