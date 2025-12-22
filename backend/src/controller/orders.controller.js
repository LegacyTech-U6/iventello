const sequelizeQuery = require("sequelize-query");
const db = require("../config/db");
const { Order, Product, Supplier } = db;

const queryParser = sequelizeQuery(db);

const OrdersController = {
  // 🔹 Récupérer toutes les commandes
  async getAllOrders(req, res) {
    try {
      const query = await queryParser.parse(req);
      const orders = await Order.findAll({
        ...query,
        include: [
          { model: Product, attributes: ["id", "Prod_name"] },
          {
            model: Supplier,
            attributes: [
              "id",
              "supplier_name",
              "email",
              "whatsapp_number",
              "preferred_channel",
            ],
          },
        ],
        order: [["id", "DESC"]],
      });
      const count = await Order.count({ where: query.where });
      res.json({ success: true, count, orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🔹 Récupérer une commande par ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: { id },
        include: [
          { model: Product, attributes: ["id", "Prod_name"] },
          {
            model: Supplier,
            attributes: [
              "id",
              "supplier_name",
              "email",
              "whatsapp_number",
              "preferred_channel",
            ],
          },
        ],
      });
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Commande non trouvée" });
      res.json({ success: true, order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🔹 Créer une commande
  async createOrder(req, res) {
    try {
      const { product_id, supplier_id, quantity } = req.body;

      if (
        !product_id ||
        !supplier_id ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Body invalide" });
      }

      const product = await Product.findByPk(product_id);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Produit introuvable" });

      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier)
        return res
          .status(404)
          .json({ success: false, message: "Fournisseur introuvable" });

      const order = await Order.create({ product_id, supplier_id, quantity });

      // Notifications
      let statusToSet = "pending";
      try {
        const message = `Commande: ${quantity} x ${product.Prod_name}`;
        if (
          supplier.preferred_channel === "whatsapp" &&
          supplier.whatsapp_number
        ) {
          await sendWhatsApp(supplier.whatsapp_number, message);
        } else if (supplier.email) {
          await sendEmail(supplier.email, "Commande Stockly", message);
        }
        statusToSet = "sent";
      } catch (notifyErr) {
        console.error("[Notification error]", notifyErr);
      }

      order.status = statusToSet;
      await order.save();

      res.status(201).json({
        success: true,
        message:
          statusToSet === "sent"
            ? "Commande créée et notification envoyée"
            : "Commande créée mais notification non envoyée",
        orderId: order.id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 🔹 Mettre à jour le statut d'une commande
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowed = new Set(["pending", "sent", "delivered"]);
      if (!allowed.has(status))
        return res
          .status(400)
          .json({ success: false, message: "Statut invalide" });

      const order = await Order.findByPk(id);
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Commande non trouvée" });

      order.status = status;
      await order.save();

      res.json({ success: true, message: "Statut mis à jour" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = OrdersController;
