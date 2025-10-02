const { body, query, validationResult } = require("express-validator");
const reviewService = require("../services/ReviewService");
const Review = require("../models/review"); // ✅ make sure to import Review

// ------------------- General Review -------------------
const createGeneralReview = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { rating, comment } = req.body;
      const review = await reviewService.createGeneralReview(req.user._id, rating, comment);
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
];

const updateGeneralReview = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { rating, comment } = req.body;
      const review = await reviewService.updateGeneralReview(req.user._id, rating, comment);
      res.json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
];

// ------------------- Product Review -------------------
const createProductReview = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { productId, rating, comment } = req.body;
      const review = await reviewService.createProductReview(req.user._id, productId, rating, comment);
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
];

const updateProductReview = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { productId, rating, comment } = req.body;
      const review = await reviewService.updateProductReview(req.user._id, productId, rating, comment);
      res.json({ success: true, data: review });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
];

// ------------------- Get Reviews -------------------
const getReviews = [
  query("productId").optional().isMongoId().withMessage("Invalid product ID"),
  query("all").optional().isBoolean().withMessage("All parameter must be boolean"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { productId, all } = req.query;
      const reviews = await reviewService.getReviews(productId, all === "true");
      res.json({ success: true, data: reviews });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
];

// ------------------- Delete Review -------------------
const deleteReview = [
  query("productId").optional().isMongoId().withMessage("Invalid product ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
      const { productId } = req.query;
      await reviewService.deleteReview(req.user._id, productId);
      res.json({ success: true, message: "Review deleted" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
];

// ------------------- Bulk Delete (Admin) -------------------
const deleteMultipleReviews = async (req, res) => {
  try {
    const { ids } = req.body; // array of review IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No review IDs provided" });
    }

    const deleted = await reviewService.deleteMultipleReviews(ids);

    res.status(200).json({
      success: true,
      message: `${deleted.deletedCount} review(s) deleted successfully`,
    });
  } catch (err) {
    console.error("Bulk delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete reviews" });
  }
};

module.exports = {
  createGeneralReview,
  updateGeneralReview,
  createProductReview,
  updateProductReview,
  getReviews,
  deleteReview,
  deleteMultipleReviews,
};
