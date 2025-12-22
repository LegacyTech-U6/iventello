const sequelizeQuery = require("sequelize-query");
const  { Op } = require( "sequelize");
const  db = require('../config/db')  // tes modèles Sequelize
const queryParser = sequelizeQuery(db);
exports.getDailySalesReport = async (req, res) => {
  try {
    const entrepriseId = req.entrepriseId; // entreprise actuelle
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 1️⃣ Récupérer toutes les factures du jour
    const invoices = await db.Invoice.findAll({
      where: {
        entreprise_id: entrepriseId,
        createdAt: { [Op.between]: [startOfDay, endOfDay] },
      },
      include: [
        {
          model: db.Client,
          as: "client",
          attributes: ["id", "client_name"],
        },
        {
          model: db.InvoiceItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ["id", "Prod_name"],
              include: [
                {
                  model: db.Category,
                  as: "category",
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    if (!invoices.length)
      return res.status(200).json({ message: "Aucune vente pour ce jour." });

    // 2️⃣ Calculer totaux et transactions
    let totalSales = 0;
    let totalItemsSold = 0;
    const productMap = {};

    const details = invoices.map((invoice) => {
      const invoiceTotal = invoice.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );

      totalSales += invoiceTotal;
      totalItemsSold += invoice.items.reduce((sum, item) => sum + item.quantity, 0);

      // Construire top_products
      invoice.items.forEach((item) => {
        const key = item.product.id;
        if (!productMap[key]) {
          productMap[key] = {
            product_id: item.product.id,
            product_name: item.product.Prod_name,
            quantity_sold: 0,
            total_amount: 0,
          };
        }
        productMap[key].quantity_sold += item.quantity;
        productMap[key].total_amount += item.quantity * item.unit_price;
      });

      return {
        invoice_id: invoice.id,
        customer_name: invoice.client.client_name,
        amount: invoiceTotal,
        date: invoice.createdAt,
        payment_method: invoice.payment_method,
      };
    });

    // 3️⃣ Top produits
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity_sold - a.quantity_sold)
      .slice(0, 5);

    // 4️⃣ Regroupement par catégorie
    const salesByCategoryMap = {};
    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const categoryName = item.product.category?.name || "Uncategorized";
        if (!salesByCategoryMap[categoryName]) salesByCategoryMap[categoryName] = 0;
        salesByCategoryMap[categoryName] += item.quantity * item.unit_price;
      });
    });
    const salesByCategory = Object.entries(salesByCategoryMap).map(([category, total]) => ({
      category,
      total,
    }));

    // 5️⃣ Réponse finale
    const report = {
      date: new Date().toISOString().split("T")[0],
      total_sales: totalSales,
      total_items_sold: totalItemsSold,
      transactions: invoices.length,
      average_sale: Number((totalSales / invoices.length).toFixed(2)),
      top_products: topProducts,
      sales_by_category: salesByCategory,
      details,
    };
    await db.salesReport.upsert({
  date: new Date().toISOString().split("T")[0],
  total_sales: totalSales,
  total_items_sold: totalItemsSold,
  transactions: invoices.length,
  average_sale: Number((totalSales / invoices.length).toFixed(2)),
  top_products: topProducts,
  sales_by_category: salesByCategory,
  details,
  entreprise_id: entrepriseId,
});


    res.status(200).json(report);
  } catch (error) {
    console.error("Erreur génération rapport:", error);
    res.status(500).json({ error: "Erreur lors de la génération du rapport." });
  }
};
exports.getReport = async (req, res) => {
  try {
    const entreprise_id = req.entrepriseId;
    if (!entreprise_id) {
      return res.status(400).json({ message: "Entreprise ID missing" });
    }

    const query = await queryParser.parse(req);
    query.where = { ...query.where, entreprise_id };

    console.log("Query where:", query.where);

    const data = await db.salesReport.findAll({
      ...query,
     
    });

    const count = await db.salesReport.count({
      where: query.where,
    });


    res.status(200).json({ count, data });
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ message: err.message });
  }
};

