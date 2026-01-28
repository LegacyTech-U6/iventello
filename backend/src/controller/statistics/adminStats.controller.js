const adminStatsModel = require("../../models/statistics/adminStats");

const getDashboardStats = async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }

    const [stats, performance, activities] = await Promise.all([
      adminStatsModel.getGlobalStats(),
      adminStatsModel.getEnterprisePerformance(),
      adminStatsModel.getRecentGlobalActivities(15),
    ]);

    res.json({
      stats,
      performance,
      activities,
    });
  } catch (error) {
    console.error("Erreur getDashboardStats:", error);
    res.status(500).json({ error: error.message });
  }
};

const getEnterpriseReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    // ... logic for detailed report if needed, otherwise we can use the existing enterprise performance list
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getEnterpriseReport,
};
