const mongoose = require("mongoose");
const Review = require("../models/review");

async function cleanDuplicateReviews() {
  await mongoose.connect("mongodb://localhost:27017/indiaculture", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clean duplicate general reviews (product: null)
  const generalDuplicates = await Review.aggregate([
    { $match: { product: null } },
    { $group: { _id: "$user", reviews: { $push: "$$ROOT" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  for (const user of generalDuplicates) {
    const reviews = user.reviews.sort((a, b) => b.createdAt - a.createdAt); // Keep latest
    const toDelete = reviews.slice(1); // Delete older duplicates
    for (const review of toDelete) {
      await Review.findByIdAndDelete(review._id);
    }
    console.log(`Cleaned ${toDelete.length} duplicate general reviews for user ${user._id}`);
  }

  // Clean duplicate product reviews (user + product)
  const productDuplicates = await Review.aggregate([
    { $match: { product: { $ne: null } } },
    { $group: { _id: { user: "$user", product: "$product" }, reviews: { $push: "$$ROOT" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  for (const group of productDuplicates) {
    const reviews = group.reviews.sort((a, b) => b.createdAt - a.createdAt); // Keep latest
    const toDelete = reviews.slice(1); // Delete older duplicates
    for (const review of toDelete) {
      await Review.findByIdAndDelete(review._id);
    }
    console.log(`Cleaned ${toDelete.length} duplicate product reviews for user ${group._id.user}, product ${group._id.product}`);
  }

  console.log("Cleanup complete");
  mongoose.disconnect();
}

cleanDuplicateReviews().catch(console.error);