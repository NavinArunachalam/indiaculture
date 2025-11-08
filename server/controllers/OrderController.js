const orderService = require("../services/OrderService");

// ------------------ USER ROUTES ------------------

// Create order
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;
    const order = await orderService.createOrder(userId, orderData);
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// Get single order for user
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user._id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ------------------ ADMIN ROUTES ------------------

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// Get single order by ID
const getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByIdAdmin(req.params.id);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Update order (status/payment)
const updateOrder = async (req, res, next) => {
  try {
    const { status, is_paid } = req.body;
    const order = await orderService.updateOrder(req.params.id, { status, is_paid });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrder,
};
