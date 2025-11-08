// controllers/dashboardController.js
const dashboardService = require("../services/DashboardService");

const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

module.exports = { getDashboard };
