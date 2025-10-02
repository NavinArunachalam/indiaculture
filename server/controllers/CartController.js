const cartService = require("../services/CartService");

// 🛒 Get cart
exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user, req.sessionID);
    res.json({ items: cart.items, cartId: cart._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(
      req.user,
      req.sessionID,
      productId,
      quantity
    );
    res.json({ items: cart.items, cartId: cart._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(
      req.user,
      req.sessionID,
      productId,
      quantity
    );
    res.json({ items: cart.items, cartId: cart._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Remove item
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(
      req.user,
      req.sessionID,
      productId
    );
    res.json({ items: cart.items, cartId: cart._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user, req.sessionID);
    res.json({ items: cart.items, cartId: cart._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
