const { createUser, loginUser, getUserById, updateAddress, getAllUsers, updateUserRole } = require("../services/UserService");
const User = require("../models/User");
// ✅ Register
const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    req.session.userId = user._id; // store session
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Set session cookie
    req.session.userId = user._id;

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Logout
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("connect.sid", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.json({ message: "Logged out" });
  });
};

// ✅ Get current user
const getProfile = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
  const user = await getUserById(req.session.userId);
  res.json(user);
};

// Update user address
const updateUserAddress = async (req, res) => {
  const { pincode, city, state, address } = req.body;

  try {
    if (!pincode || !city || !state || !address) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const updatedUser = await updateAddress(
      req.user._id, // assuming user is authenticated and req.user is set
      { pincode, city, state, address },
      { new: true } // return updated document
    );

    res.json({ message: "Address updated", data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update address" });
  }
};

const adminGetAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};


// ✅ Admin - Get single user by ID
// ✅ Admin - Get single user by ID
const adminGetUserById = async (req, res, next) => {
  try {
    const { id } = req.params; // match route param
    const user = await getUserById(id); // service handles errors

    res.json({ message: "User fetched successfully", user });
  } catch (err) {
    if (err.message === "User not found" || err.message === "Invalid user ID") {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};

module.exports = { register, login, logout, getProfile, updateUserAddress, adminGetAllUsers, adminGetUserById };


