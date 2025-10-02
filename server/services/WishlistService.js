const Wishlist = require("../models/wishlist");
const user = require("../models/User");

const addToWishlist = async (userId, productId) => {
  return await Wishlist.create({ user: userId, product: productId });
};

const getWishlist = async (userId) => {
  return await Wishlist.find({ user: userId }).populate("product");
};

const removeFromWishlist = async (userId, productId) => {
  return await Wishlist.findOneAndDelete({ user: userId, product: productId });
};
const getAllWishlists = async () => {
  return await Wishlist.find()
    .populate("user", "name email") // include user details (name, email)
    .populate("product");               // include product details
};
module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getAllWishlists
};
