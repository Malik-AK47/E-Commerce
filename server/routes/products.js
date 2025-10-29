const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// GET /api/products - list + query search/filter
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ msg: "Product not found" });
    res.json(prod);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// POST /api/products (admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const newP = new Product(req.body);
    const saved = await newP.save();
    res.json(saved);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// PUT /api/products/:id (admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

module.exports = router;
