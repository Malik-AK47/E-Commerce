const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Admin resource. Access denied." });
    }
    next();
  } catch (err) {
    next(err);
  }
};
