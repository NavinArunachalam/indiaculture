const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const appRoutes = require("./routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies/auth headers
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

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
    maxAge: 1000 * 60 * 60 * 60 * 60* 24,
    sameSite: "lax",
    secure: false,
  },
});

app.use("/api", userSession);

appRoutes(app);

app.get("/", (req, res) => {
  res.json({ message: "Express backend is running!" });
});

// -------------------
// Centralized error handling
// -------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.disable("etag");

// -------------------
// Connect DB & Start server
// -------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });
