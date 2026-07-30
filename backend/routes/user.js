const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// @route   PATCH /api/user/subscription
// @desc    Subscribe or toggle "ServiceHub Plus" plan
router.patch("/subscription", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.subscription = {
      isPlus: true,
      planName: "ServiceHub VIP Plus",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      discountPercentage: 10,
    };

    await user.save();
    res.json({ success: true, message: "Successfully upgraded to ServiceHub Plus!", subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: "Subscription upgrade failed." });
  }
});

// @route   POST /api/user/addresses
// @desc    Add or update customer address
router.post("/addresses", verifyToken, async (req, res) => {
  try {
    const { title, street, city, state, zip, lat, lng } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const newAddr = {
      title: title || "Home",
      street: street || "",
      city: city || "Delhi",
      state: state || "Delhi",
      zip: zip || "110001",
      lat: Number(lat) || 28.6139,
      lng: Number(lng) || 77.209,
      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddr);
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving address." });
  }
});

module.exports = router;
