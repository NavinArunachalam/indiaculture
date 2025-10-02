const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const appRoutes = require("./routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ✅ Session config
const userSession = session({
  name: "connect.sid",
  secret: process.env.SESSION_SECRET || "SecretKey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});
app.use("/api", userSession);

// ✅ Routes
appRoutes(app);

// ✅ Default route
app.get("/", (req, res) => {
  res.json({ message: "Express backend is running on Vercel!" });
});

// ✅ Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.disable("etag");

// -------------------
// ❌ REMOVE app.listen()
// -------------------

// ✅ Instead export app (Vercel needs this)
connectDB()
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });

module.exports = app;
