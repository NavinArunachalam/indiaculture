const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");

const getDashboardStats = async () => {
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based (0 = January, 11 = December)
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 1);

  // Total stats for current month
  const totalSalesAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const totalSales = totalSalesAgg[0]?.totalSales || 0;
  const totalOrders = totalSalesAgg[0]?.totalOrders || 0;

  // Total customers (distinct users who placed orders in the current month)
  const totalCustomers = await Order.distinct("user", {
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  }).then((arr) => arr.length);

  // Top products (sold count)
  const topProductsAgg = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        sold: { $sum: "$items.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: "$product._id",
        name: "$product.name",
        sold: 1,
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  // Sales by category
  const salesByCategory = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $project: { name: "$_id", totalSales: 1, _id: 0 } },
  ]);

  // Recent orders for the current month
  const recentOrders = await Order.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean();


  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);

  const monthlySalesAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lt: endOfYear },
        is_paid: true // only count paid orders
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  // Convert to [Jan..Dec] format
  const monthlySales = Array(12).fill(0);
  monthlySalesAgg.forEach((s) => {
    monthlySales[s._id.month - 1] = s.total; // month is 1–12
  });


  return {
    stats: { totalSales, totalOrders, totalCustomers },
    topProducts: topProductsAgg,
    salesByCategory,
    recentOrders,
    monthlySales,
  };
};
// Add this inside getDashboardStats before return


module.exports = { getDashboardStats };