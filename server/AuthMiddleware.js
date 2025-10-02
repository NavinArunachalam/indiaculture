// middlewares/authMiddleware.js
const User = require("./models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session.userId) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    // Fetch the user from DB
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
