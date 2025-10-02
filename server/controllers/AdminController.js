const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretadmin";

// ------------------- LOGIN ADMIN -------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.is_superuser) {
      return res.status(401).json({ message: "Unauthorized: Not an admin" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Create JWT token
    const token = jwt.sign(
      { adminId: user._id, name: user.name, email: user.email },
      ADMIN_JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send token in HTTP-only cookie
    res.cookie("admin_jwt", token, {
      httpOnly: true,       // not accessible via JS
      maxAge: 10 * 365 * 24* 60 * 60 *1000, 
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", // true in production with HTTPS
    });

    res.status(200).json({
      message: "Admin login successful",
      admin: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GET ADMIN PROFILE -------------------
const getAdminProfile = (req, res) => {
  const admin = req.admin; // set by JWT middleware
  if (!admin) return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json({ admin });
};

// ------------------- LOGOUT ADMIN -------------------
const logoutAdmin = (req, res) => {
  // Clear the cookie
  res.clearCookie("admin_jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Admin logged out" });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
