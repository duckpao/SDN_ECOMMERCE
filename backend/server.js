const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const router = require("./src/router/index");

const app = express();
const cors = require("cors");

connectDB();

/* BUG 5 FIX: Remove duplicate cors() */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use("/", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to SDN Ecommerce API" });
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log("localhost://" + PORT);
});
