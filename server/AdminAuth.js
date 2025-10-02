const jwt = require("jsonwebtoken");
const User = require("./models/User");
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretadmin";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_jwt; // read from cookie
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    const user = await User.findById(decoded.adminId);
    if (!user || (!user.is_superuser && !user.is_staff)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.admin = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { isAdmin };
