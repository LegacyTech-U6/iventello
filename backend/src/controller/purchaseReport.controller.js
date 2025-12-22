const { Op } = require("sequelize");
const db = require("../config/db");

exports.generateDailyPurchaseReport = async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const entrepriseId = req.entrepriseId;
  const purchases = await db.Purchase.findAll({
    where: {
      entreprise_id: entrepriseId,
      purchase_date: { [Op.between]: [startOfDay, endOfDay] },
    },
    include: [
      {
        model: db.PurchaseItem,
        as: "items",
        include: [
          { model: db.Product, as: "product", attributes: ["id", "Prod_name"] },
        ],
      },
    ],
  });

  if (!purchases.length) return null;

  let totalPurchases = 0;
  let totalItemsPurchased = 0;
  const productMap = {};
  const supplierMap = {};
  const details = [];

  purchases.forEach((p) => {
    totalPurchases += parseFloat(p.total_amount);
    let purchaseItemsCount = 0;

    p.items.forEach((item) => {
      totalItemsPurchased += item.quantity;
      purchaseItemsCount += item.quantity;

      // top products
      const key = item.product.id;
      if (!productMap[key])
        productMap[key] = {
          product_id: item.product.id,
          product_name: item.product.Prod_name,
          quantity_purchased: 0,
          total_amount: 0,
        };
      productMap[key].quantity_purchased += item.quantity;
      productMap[key].total_amount +=
        item.quantity * parseFloat(item.unit_cost);
    });

    // achats par fournisseur
    if (!supplierMap[p.supplier_name]) supplierMap[p.supplier_name] = 0;
    supplierMap[p.supplier_name] += parseFloat(p.total_amount);

    // détails
    details.push({
      purchase_id: p.id,
      supplier_name: p.supplier_name,
      total_amount: parseFloat(p.total_amount),
      items_count: purchaseItemsCount,
      date: p.purchase_date,
      payment_method: p.payment_method,
    });
  });

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.quantity_purchased - a.quantity_purchased)
    .slice(0, 5);
  const purchasesBySupplier = Object.entries(supplierMap).map(
    ([supplier, total]) => ({ supplier, total })
  );

  // upsert report
  await db.DailyPurchaseReport.upsert({
    date: today.toISOString().split("T")[0],
    total_purchases: totalPurchases,
    total_items_purchased: totalItemsPurchased,
    transactions: purchases.length,
    average_purchase: totalPurchases / purchases.length,
    top_products: topProducts,
    purchases_by_supplier: purchasesBySupplier,
    details,
    entreprise_id: entrepriseId,
  });
};
