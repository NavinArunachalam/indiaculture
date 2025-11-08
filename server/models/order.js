const mongoose = require("mongoose");
const Counter = require("./counter");

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    payment_method: { type: String, default: "COD" },
    shipping: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    is_paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Sequential order code
orderSchema.pre("save", async function (next) {
  if (!this.code) {
    const counter = await Counter.findOneAndUpdate(
      { name: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.code = `ORD${counter.seq}`;
  }
  next();
});

// ✅ Safe model export
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
