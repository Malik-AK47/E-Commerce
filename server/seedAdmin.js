const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const adminEmail = "admin@shop.com";
  let admin = await User.findOne({ email: adminEmail });
  if (admin) {
    console.log("Admin already exists");
    process.exit(0);
  }
  const hash = await bcrypt.hash("Admin@123", 10);
  admin = new User({ name: "Admin", email: adminEmail, password: hash, role: "admin" });
  await admin.save();
  console.log("Admin created -> email:", adminEmail, "password: Admin@123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
