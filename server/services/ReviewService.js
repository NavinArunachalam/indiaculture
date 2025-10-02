const Review = require("../models/review");
const mongoose = require("mongoose");

// Validate rating and comment
const validateReview = (rating, comment) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  if (comment && comment.length > 500) {
    throw new Error("Comment cannot exceed 500 characters");
  }
};

// Create Product Review
const createProductReview = async (userId, productId, rating, comment) => {
  if (!mongoose.isValidObjectId(productId)) throw new Error("Invalid product ID");
  validateReview(rating, comment);

  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) throw new Error("You have already reviewed this product");

  const review = new Review({ user: userId, product: productId, rating, comment });
  return await review.save();
};

// Create General Review
const createGeneralReview = async (userId, rating, comment) => {
  validateReview(rating, comment);

  const existing = await Review.findOne({ user: userId, product: null });
  if (existing) throw new Error("You have already submitted a general review");

  const review = new Review({ user: userId, product: null, rating, comment });
  return await review.save();
};

// Update Product Review
const updateProductReview = async (userId, productId, rating, comment) => {
  if (!mongoose.isValidObjectId(productId)) throw new Error("Invalid product ID");
  validateReview(rating, comment);

  const review = await Review.findOne({ user: userId, product: productId });
  if (!review) throw new Error("No review found for this product");

  review.rating = rating;
  review.comment = comment;
  return await review.save();
};

// Update General Review
const updateGeneralReview = async (userId, rating, comment) => {
  validateReview(rating, comment);

  const review = await Review.findOne({ user: userId, product: null });
  if (!review) throw new Error("No general review found");

  review.rating = rating;
  review.comment = comment;
  return await review.save();
};

// Get Reviews
const getReviews = async (productId = null, all = false) => {
  let query = {};

  if (productId) {
    if (!mongoose.isValidObjectId(productId)) throw new Error("Invalid product ID");
    query = { product: productId };
  } else if (all) {
    query = {};
  }

  return await Review.find(query)
    .populate("user", "name email")
    .populate("product", "name")
    .sort({ createdAt: -1 });
};

// Delete single review
const deleteReview = async (userId, productId = null) => {
  const query = productId ? { user: userId, product: productId } : { user: userId, product: null };
  const review = await Review.findOne(query);
  if (!review) throw new Error("Review not found");
  return await Review.findByIdAndDelete(review._id);
};

// Delete multiple reviews (admin)
const deleteMultipleReviews = async (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error("No review IDs provided");
  }
  return await Review.deleteMany({ _id: { $in: ids } });
};

module.exports = {
  createProductReview,
  createGeneralReview,
  updateProductReview,
  updateGeneralReview,
  getReviews,
  deleteReview,
  deleteMultipleReviews,
};
