const express = require("express");
const router = express.Router();
const RecurringBooking = require("../models/RecurringBooking");
const { verifyToken } = require("../middleware/auth");

// Get customer recurring plans
router.get("/my", verifyToken, async (req, res) => {
  try {
    const plans = await RecurringBooking.find({ customer: req.user.id }).populate("services.service");
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading recurring plans." });
  }
});

module.exports = router;
