const { createUser, loginUser, getUserById, updateAddress, getAllUsers, updateUserRole } = require("../services/UserService");
const User = require("../models/User");

// ✅ Register
const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    
    // ✅ Set and SAVE session
    req.session.userId = user._id.toString();
    
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    next(err);
  }
};

// ✅ Fixed Login - CRITICAL FIXES
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Set session data
    req.session.userId = user._id.toString();
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    // ✅ SAVE SESSION - THIS WAS MISSING!
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // ✅ Set proper cookie options in response
    res.cookie('connect.sid', req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      sessionId: req.sessionID // for debugging
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Fixed Logout
const logout = async (req, res) => {
  try {
    if (req.session) {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('Logout session destroy error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    // ✅ Clear cookie with proper options
    res.clearCookie("connect.sid", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: '/'
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: "Logout failed" });
  }
};

// ✅ Fixed Get Profile
const getProfile = async (req, res) => {
  try {
    // ✅ Check session exists and is saved
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not logged in - no session" });
    }

    const user = await getUserById(req.session.userId);
    
    // ✅ Refresh session
    await new Promise((resolve, reject) => {
      req.session.touch((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      ...user.toObject(),
      sessionId: req.sessionID // for debugging
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Fixed Update User Address
const updateUserAddress = async (req, res) => {
  try {
    // ✅ Use session instead of req.user
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated - no session" });
    }

    const { pincode, city, state, address } = req.body;

    if (!pincode || !city || !state || !address) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const updatedUser = await updateAddress(
      req.session.userId, // ✅ Use session ID
      { pincode, city, state, address },
      { new: true }
    );

    // ✅ Save session after update
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: "Address updated", data: updatedUser });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// ✅ Admin Get All Users
const adminGetAllUsers = async (req, res, next) => {
  try {
    // ✅ Check admin session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// ✅ Admin Get User By ID
const adminGetUserById = async (req, res, next) => {
  try {
    // ✅ Check admin session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const { id } = req.params;
    const user = await getUserById(id);

    res.json({ message: "User fetched successfully", user });
  } catch (err) {
    if (err.message === "User not found" || err.message === "Invalid user ID") {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};

module.exports = { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateUserAddress, 
  adminGetAllUsers, 
  adminGetUserById 
};