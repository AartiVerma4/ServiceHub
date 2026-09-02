const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Referral = require("../models/Referral");
const { verifyToken } = require("../middleware/auth");

// Get referrals list
router.get("/my", verifyToken, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id }).populate("referee", "name email");
    res.json({ success: true, referrals });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching referrals." });
  }
});

module.exports = router;
