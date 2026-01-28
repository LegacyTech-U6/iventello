const db = require("../../config/db");
const { Sales, Product, Entreprise, Worker, Sequelize, Client, activities } =
  db;
const { fn, col, literal } = Sequelize;

async function getGlobalStats() {
  const [
    revenueStats,
    enterpriseCount,
    productCount,
    workerCount,
    clientCount,
  ] = await Promise.all([
    Sales.findOne({
      attributes: [
        [fn("SUM", col("total_price")), "total_revenue"],
        [fn("SUM", col("total_profit")), "total_profit"],
        [fn("COUNT", col("id")), "total_sales_count"],
      ],
      raw: true,
    }),
    Entreprise.count(),
    Product.count(),
    Worker.count(),
    Client.count(),
  ]);

  return {
    totalRevenue: Number(revenueStats.total_revenue) || 0,
    totalProfit: Number(revenueStats.total_profit) || 0,
    totalSales: Number(revenueStats.total_sales_count) || 0,
    totalEnterprises: enterpriseCount,
    totalProducts: productCount,
    totalWorkers: workerCount,
    totalClients: clientCount,
  };
}

async function getEnterprisePerformance() {
  const enterprises = await Entreprise.findAll({
    include: [
      {
        model: Sales,
        as: "sales",
        attributes: [],
      },
    ],
    attributes: [
      "id",
      "name",
      "uuid",
      "logo_url",
      "currency",
      [fn("COALESCE", fn("SUM", col("sales.total_price")), 0), "revenue"],
      [fn("COALESCE", fn("SUM", col("sales.total_profit")), 0), "profit"],
      [fn("COUNT", fn("DISTINCT", col("sales.id"))), "sales_count"],
    ],
    group: ["Entreprise.id"],
    order: [[literal("revenue"), "DESC"]],
    raw: true,
  });

  return enterprises.map((e) => ({
    ...e,
    revenue: Number(e.revenue),
    profit: Number(e.profit),
    sales_count: Number(e.sales_count),
  }));
}

async function getRecentGlobalActivities(limit = 10) {
  const logs = await activities.findAll({
    limit,
    order: [["created_at", "DESC"]],
    include: [
      { model: db.User, as: "user", attributes: ["username"] },
      { model: db.Entreprise, as: "entreprise", attributes: ["name", "uuid"] },
      { model: db.Worker, as: "worker", attributes: ["name"] },
    ],
  });
  return logs;
}

module.exports = {
  getGlobalStats,
  getEnterprisePerformance,
  getRecentGlobalActivities,
};
