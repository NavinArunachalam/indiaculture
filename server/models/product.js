const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  old_price: { type: Number },
  new_price: { type: Number, required: true },
  offer_line: { type: String },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  stock: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  is_bestsell: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
module.exports = Product;
