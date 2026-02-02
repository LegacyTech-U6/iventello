const {
  getSales,
  getProfit,
  getClients,
  getTopProducts,
  getRevenueByCategory,
} = require("../../models/statistics/stats");

module.exports = {
  /**
   * 🔹 Ventes par période
   * GET /api/stats/sales?period=month&enterpriseId=1
   */
  sales: async (req, res) => {
    try {
      const period = req.query.period || "month";
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;

      const result = await getSales({
        period,
        enterpriseId,
        userId: req.user?.id,
      });

      res.json({ period, sales: result });
    } catch (error) {
      console.error("Erreur sales:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 🔹 Profit par période
   * GET /api/stats/profit?period=month&enterpriseId=1
   */
  profit: async (req, res) => {
    try {
      const period = req.query.period || "month";
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;

      const result = await getProfit({
        period,
        enterpriseId,
        userId: req.user?.id,
      });

      res.json({ period, profit: result });
    } catch (error) {
      console.error("Erreur profit:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 🔹 Clients par période
   * GET /api/stats/clients?period=month&enterpriseId=1
   */
  clients: async (req, res) => {
    try {
      const period = req.query.period || "month";
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;

      const result = await getClients({
        period,
        enterpriseId,
        userId: req.user?.id,
      });

      res.json({ period, clients: result });
    } catch (error) {
      console.error("Erreur clients:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 🔹 Meilleurs produits
   * GET /api/stats/products?limit=10&enterpriseId=1
   */
  topProducts: async (req, res) => {
    try {
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;
      const limit = parseInt(req.query.limit) || 10;

      const products = await getTopProducts({
        enterpriseId,
        userId: req.user?.id,
        limit,
      });

      res.json({ products });
    } catch (error) {
      console.error("Erreur topProducts:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 🔹 Revenu par catégorie
   * GET /api/stats/revenue-by-category?period=month&enterpriseId=1
   */
  revenueByCategory: async (req, res) => {
    try {
      const period = req.query.period || "month";
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;

      const result = await getRevenueByCategory({
        period,
        enterpriseId,
        userId: req.user?.id,
      });

      res.json({ period, revenue: result });
    } catch (error) {
      console.error("Erreur revenueByCategory:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * 🔹 Dépenses par période
   * GET /api/stats/expenses?period=month&enterpriseId=1
   */
  expenses: async (req, res) => {
    try {
      const period = req.query.period || "month";
      const enterpriseId = req.query.enterpriseId || req?.entrepriseId;

      const result =
        await require("../../models/statistics/stats").getExpensesStats({
          period,
          enterpriseId,
          userId: req.user?.id,
        });

      res.json({ period, expenses: result });
    } catch (error) {
      console.error("Erreur expenses:", error);
      res.status(500).json({ error: error.message });
    }
  },
};
