const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/orders  (create order for logged user)
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ msg: "No order items" });

    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const created = await order.save();
    res.status(201).json(created);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// GET /api/orders/myorders
router.get("/myorders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// GET /api/orders/  (admin - list all orders)
const admin = require("../middleware/admin");
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

// GET /api/orders/:id  (user or admin)
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.user._id.toString() !== req.user.id) {
      // do not reveal for other users unless admin (you can check role here)
      return res.status(403).json({ msg: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    console.error(err); res.status(500).send("Server error");
  }
});

module.exports = router;
