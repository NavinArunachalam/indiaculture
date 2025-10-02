const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("Email already exists");

  const user = new User(data);
  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

const getUserById = async (id) => {
  // Validate ObjectId
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id).select("-password"); // exclude password
  if (!user) throw new Error("User not found");
  return user;
};




const updateAddress = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Update flat address fields
  user.name = data.name || user.name;
  user.mobile = data.mobile || user.mobile;
  user.pincode = data.pincode || user.pincode;
  user.city = data.city || user.city;
  user.state = data.state || user.state;
  user.address = data.address || user.address;

  await user.save();
  return user;
};

// Get all users
const getAllUsers = async () => {
  return await User.find().select("-password");
};



module.exports = { createUser, loginUser, getUserById, updateAddress, getAllUsers,};


