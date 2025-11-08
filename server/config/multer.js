const multer = require("multer");

// Memory storage for buffer upload
const storage = multer.memoryStorage();

// Generic file filter for images and videos
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
    return cb(new Error("Only image and video files are allowed"), false);
  }
  cb(null, true);
};

// -------------------- HERO UPLOAD --------------------
// Multiple hero images/videos (max 4)
const heroUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter,
});

// -------------------- PRODUCT UPLOAD --------------------
// Multiple product images/videos (max 4)
const productUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter,
});

// -------------------- REELS UPLOAD --------------------
// Single reel video (optional limit 50MB)
const reelSingleUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
    cb(null, true);
  },
});

// -------------------- CATEGORY UPLOAD --------------------
// Single category image
const categoryUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// -------------------- OFFER UPLOAD --------------------
// Single offer image
const offerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = {
  heroUpload,
  productUpload,
  reelSingleUpload,
  categoryUpload,
  offerUpload,
};