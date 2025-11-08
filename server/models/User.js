const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  mobile: { type: String, maxlength: 10 },
  pincode: { type: String, maxlength: 6 },
  city: { type: String, maxlength: 100 },
  address: { type: String },
  state: { type: String, maxlength: 100 },
  password: { type: String, required: true, minlength: 6 },
  is_active: { type: Boolean, default: true },
  is_staff: { type: Boolean, default: false },
  is_superuser: { type: Boolean, default: false },
}, { timestamps: true });

// 🔑 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
