// services/DashboardService.js
const Order = require("../models/order");
const Product = require("../models/product");
const Category = require("../models/category");

const getDashboardStats = async () => {
  // Total stats
  const totalSalesAgg = await Order.aggregate([
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

  // Total customers
  const totalCustomers = await Order.distinct("user").then((arr) => arr.length);

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

  // Recent orders
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .lean();

  return {
    stats: { totalSales, totalOrders, totalCustomers },
    topProducts: topProductsAgg,
    salesByCategory,
    recentOrders,
  };
};

module.exports = { getDashboardStats };
