const {
  Product,
  Sales,
  Client,
  Entreprise,
  Sequelize,
} = require("../../config/db");
const { Op, fn, col, literal } = Sequelize;
const db = require("../../config/db");
const { sequelize } = require("../../config/db");
function formatDate(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
const BASE_URL = process.env.BASE_URL;

// 🔹 Récupère les IDs d'entreprise d'un utilisateur
async function getEnterpriseIds(userId) {
  if (!userId) return [];
  const enterprises = await Entreprise.findAll({
    where: { user_id: userId },
    attributes: ["id"],
  });
  return enterprises.map((e) => e.id);
}

// 🔹 Prépare le filtre entreprise/user
async function getFilter({ userId, enterpriseId }) {
  if (enterpriseId) return { entreprise_id: enterpriseId };
  if (userId) {
    const ids = await getEnterpriseIds(userId);
    return ids.length ? { entreprise_id: ids } : null;
  }
  return null;
}

// 🔹 Formater la date selon la période
function getDateFormat(period) {
  switch (period) {
    case "day":
      return "YYYY-MM-DD";
    case "week":
      return "IYYY-IW";
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    default:
      return "YYYY-MM";
  }
}

// 🔹 Calcul de la croissance %
function computeGrowth(history) {
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].value;
    const curr = history[i].value;
    history[i].growth_percent = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  }
  if (history.length) history[0].growth_percent = 0;
  return history;
}

// 🔹 Stats ventes
async function getSales({ userId, enterpriseId, period }) {
  const filter = await getFilter({ userId, enterpriseId });
  if (filter === null) return { total: 0, history: [] };

  const dateFormat = getDateFormat(period);

  const rows = await Sales.findAll({
    include: { model: Product, as: "product", where: filter, attributes: [] },
    attributes: [
      [fn("TO_CHAR", col("sale_date"), dateFormat), "period"],
      [fn("SUM", col("total_price")), "value"],
    ],
    group: ["period"],
    order: [["period", "ASC"]],
  });

  const history = rows.map((r) => ({
    period: r.dataValues.period,
    value: Number(r.dataValues.value),
    growth_percent: 0,
  }));
  const total = history.reduce((a, h) => a + h.value, 0);
  return { total, history: computeGrowth(history) };
}

// 🔹 Stats profit
async function getProfit({ userId, enterpriseId, period = "month" }) {
  const filter = await getFilter({ userId, enterpriseId });
  if (filter === null) return { total: 0, history: [] };

  const dateFormat = getDateFormat(period);

  const rows = await Sales.findAll({
    include: { model: Product, as: "product", where: filter, attributes: [] },
    attributes: [
      [fn("TO_CHAR", col("sale_date"), dateFormat), "period"],
      [
        fn("SUM", literal("quantity_sold * (selling_price - cost_price)")),
        "value",
      ],
    ],
    group: ["period"],
    order: [["period", "ASC"]],
  });

  const history = rows.map((r) => ({
    period: r.dataValues.period,
    value: Number(r.dataValues.value),
    growth_percent: 0,
  }));
  const total = history.reduce((a, h) => a + h.value, 0);
  return { total, history: computeGrowth(history) };
}

// 🔹 Stats clients
async function getClients({ userId, enterpriseId, period = "month" }) {
  const filter = await getFilter({ userId, enterpriseId });
  if (filter === null) return { total: 0, history: [] };

  const dateFormat = getDateFormat(period);

  const rows = await Client.findAll({
    where: filter,
    attributes: [
      [fn("TO_CHAR", col("createdAt"), dateFormat), "period"],
      [fn("COUNT", col("id")), "value"],
    ],
    group: ["period"],
    order: [["period", "ASC"]],
  });

  const history = rows.map((r) => ({
    period: r.dataValues.period,
    value: Number(r.dataValues.value),
    growth_percent: 0,
  }));
  const total = history.reduce((a, h) => a + h.value, 0);
  return { total, history: computeGrowth(history) };
}

// 🔹 Produits top
async function getTopProducts({
  userId,
  enterpriseId,
  limit = 10,
  period = "month",
}) {
  let entrepriseIds = [];
  if (enterpriseId) entrepriseIds = [enterpriseId];
  else if (userId) {
    const entreprises = await db.Entreprise.findAll({
      where: { user_id: userId },
      attributes: ["id"],
    });
    entrepriseIds = entreprises.map((e) => e.id);
  }
  if (entrepriseIds.length === 0) return [];

  const now = new Date();
  let startDate, endDate;
  if (period === "day") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === "week") {
    const day = now.getDay();
    startDate = new Date(now);
    startDate.setDate(now.getDate() - day);
    endDate = new Date();
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  try {
    const products = await sequelize.query(
      `
      SELECT 
        p.id,
        p."Prod_name",
        p."Prod_image",
        p.cost_price,
        p.selling_price,
        p.quantity,
        COALESCE(SUM(s.quantity_sold), 0) AS total_sold,
        COALESCE(SUM(s.total_price), 0) AS total_revenue,
        COALESCE(SUM(s.total_profit), 0) AS total_profit
      FROM "Products" p
      LEFT JOIN "Sales" s 
        ON p.id = s.product_id 
        AND s.sale_date BETWEEN :start AND :end
      WHERE p.entreprise_id IN (:entrepriseIds)
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT :limit
    `,
      {
        replacements: { start, end, entrepriseIds, limit },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return products.map((p) => ({
      id: p.id,
      name: p.Prod_name,
      image: `${BASE_URL}${p.Prod_image}`,
      cost_price: Number(p.cost_price),
      selling_price: Number(p.selling_price),
      quantity: Number(p.quantity),
      total_sold: Number(p.total_sold),
      total_revenue: Number(p.total_revenue) || 0,
      total_profit: Number(p.total_profit) || 0,
      total_cost:
        (Number(p.total_revenue) || 0) - (Number(p.total_profit) || 0),
    }));
  } catch (err) {
    console.error("Erreur SQL dans getTopProducts:", err);
    throw err;
  }
}

// 🔹 Revenu par catégorie
async function getRevenueByCategory({
  userId,
  enterpriseId,
  period = "month",
}) {
  let entrepriseIds = [];
  if (enterpriseId) entrepriseIds = [enterpriseId];
  else if (userId) {
    const entreprises = await db.Entreprise.findAll({
      where: { user_id: userId },
      attributes: ["id"],
    });
    entrepriseIds = entreprises.map((e) => e.id);
  }
  if (entrepriseIds.length === 0) return [];

  const now = new Date();
  let startDate, endDate;
  if (period === "day") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
    endDate = new Date(now.setHours(23, 59, 59, 999));
  } else if (period === "week") {
    const day = now.getDay();
    startDate = new Date(now);
    startDate.setDate(now.getDate() - day);
    endDate = new Date();
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  try {
    const rows = await sequelize.query(
      `
      SELECT 
        c.name AS category,
        COALESCE(SUM(s.total_price), 0) AS total_revenue,
        COALESCE(SUM(s.total_profit), 0) AS total_profit,
        COUNT(DISTINCT p.id) AS product_count
      FROM "Products" p
      LEFT JOIN "Sales" s ON p.id = s.product_id
      LEFT JOIN "Category" c ON p.category_id = c.id
      WHERE p.entreprise_id IN (:entrepriseIds)
        AND (s.sale_date BETWEEN :start AND :end OR s.sale_date IS NULL)
      GROUP BY c.name
      ORDER BY total_revenue DESC
    `,
      {
        replacements: { start, end, entrepriseIds },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return rows.map((r) => ({
      category: r.category || "Uncategorized",
      total_revenue: Number(r.total_revenue) || 0,
      total_profit: Number(r.total_profit) || 0,
      product_count: Number(r.product_count) || 0,
    }));
  } catch (err) {
    console.error("Erreur SQL dans getRevenueByCategory:", err);
    throw err;
  }
}

module.exports = {
  getSales,
  getProfit,
  getClients,
  getRevenueByCategory,
  getTopProducts,
};
