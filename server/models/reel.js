const mongoose = require("mongoose");

const ReelSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    media: [
      {
        url: { type: String, required: true },       // Cloudinary URL
        public_id: { type: String, required: true }, // Cloudinary public_id
        type: { type: String, enum: ["image", "video"], required: true }, // file type
      },
    ],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reel", ReelSchema);
