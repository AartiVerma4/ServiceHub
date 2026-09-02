const express = require("express");
const router = express.Router();
const AvailabilityBlock = require("../models/AvailabilityBlock");
const Provider = require("../models/Provider");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// Get my availability blocks
router.get("/blocks", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) return res.status(404).json({ success: false, message: "Provider profile not found." });
    const blocks = await AvailabilityBlock.find({ providerId: provider._id });
    res.json({ success: true, blocks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching availability blocks." });
  }
});

// Block a date
router.post("/block", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const { date, startHour, endHour, reason } = req.body;
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) return res.status(404).json({ success: false, message: "Provider profile not found." });

    const block = await AvailabilityBlock.create({
      providerId: provider._id,
      date,
      startHour: startHour || 0,
      endHour: endHour || 24,
      reason: reason || "Unavailable"
    });
    res.status(201).json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating availability block." });
  }
});

// Unblock a date
router.delete("/block/:id", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    await AvailabilityBlock.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Block removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing block." });
  }
});

module.exports = router;
