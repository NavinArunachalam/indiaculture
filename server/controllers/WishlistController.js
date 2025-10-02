const wishlistService = require("../services/WishlistService");

// ➕ Add product to wishlist
const addWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // assuming authentication middleware sets req.user
    const wishlist = await wishlistService.addToWishlist(userId, productId);
    res.status(201).json(wishlist);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    next(error);
  }
};

// 📜 View wishlist
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const wishlist = await wishlistService.getWishlist(userId);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// ❌ Remove from wishlist
const deleteWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    const result = await wishlistService.removeFromWishlist(userId, productId);
    if (!result) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};

// 👨‍💼 Admin: Get all wishlists (grouped by user)
const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await wishlistService.getAllWishlists();

    // Group wishlists by user safely
    const grouped = wishlists.reduce((acc, item) => {
      if (!item.user) {
        return acc; // skip invalid wishlist without user
      }

      const userId = item.user._id?.toString();
      if (!userId) return acc;

      if (!acc[userId]) {
        acc[userId] = {
          user: {
            _id: item.user._id,
            name: item.user.name,
            email: item.user.email,
          },
          products: [],
        };
      }

      if (item.product) {
        acc[userId].products.push(item.product);
      }

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: Object.values(grouped), // return as an array for frontend
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlists",
      error: err.message,
    });
  }
};

module.exports = {
  addWishlist,
  getWishlist,
  deleteWishlist,
  getAllWishlists,
};
