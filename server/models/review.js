const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Unique index for product reviews: one review per user per product
reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $ne: null } } }
);

// Unique index for general reviews: one general review per user
reviewSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { product: null } }
);

// Validate ObjectIds
reviewSchema.pre("validate", function (next) {
  const { isValidObjectId } = mongoose;
  if (this.user && !isValidObjectId(this.user)) {
    return next(new Error("Invalid user ID"));
  }
  if (this.product && !isValidObjectId(this.product)) {
    return next(new Error("Invalid product ID"));
  }
  next();
});

// Index for faster queries on product reviews
reviewSchema.index({ product: 1 });

module.exports = mongoose.model("Review", reviewSchema);