
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./src/models/user");
const Category = require("./src/models/category");
const Brand = require("./src/models/brand");
const Product = require("./src/models/product");
const Cart = require("./src/models/cart");
const Order = require("./src/models/order");
const Payment = require("./src/models/payment");
const Shipping = require("./src/models/shipping");

const DB_DIR = path.join(__dirname, "db_json");

function revive(key, val) {
  if (val && typeof val === "object" && val.$oid) return val.$oid;
  if (val && typeof val === "object" && val.$date) return val.$date;
  return val;
}

function readJSON(name) {
  const p = path.join(DB_DIR, name);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"), revive);
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const files = [
    ["users.json", User],
    ["categories.json", Category],
    ["brands.json", Brand],
    ["products.json", Product],
    ["carts.json", Cart],
    ["orders.json", Order],
    ["payments.json", Payment],
    ["shippings.json", Shipping],
  ];

  for (const [file, Model] of files) {
    const data = readJSON(file);
    if (data.length === 0) { console.log("Skip " + file); continue; }
    await Model.deleteMany({});
    if (Model === User) {
      for (const u of data) u.password = await bcrypt.hash(u.password, 10);
    }
    await Model.insertMany(data);
    console.log("Seeded " + file + ": " + data.length + " records");
  }

  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
