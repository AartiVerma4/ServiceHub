const express = require("express");
const router = express.Router();
const Dispute = require("../models/Dispute");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// Customer raises dispute
router.post("/", verifyToken, async (req, res) => {
  try {
    const { bookingId, category, description } = req.body;
    const dispute = await Dispute.create({
      booking: bookingId,
      raisedBy: req.user.id,
      raisedByRole: req.user.role,
      category,
      description
    });
    res.status(201).json({ success: true, dispute });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error raising dispute." });
  }
});

// Admin fetches all disputes
router.get("/admin", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate({ path: "booking", populate: { path: "customer", select: "name email phone" } })
      .populate("raisedBy", "name email");
    res.json({ success: true, disputes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading disputes." });
  }
});

// Admin resolves/rejects a dispute
router.patch("/admin/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status, resolution: resolution || "", resolvedBy: req.user.id },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ success: false, message: "Dispute not found." });
    res.json({ success: true, dispute });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resolving dispute." });
  }
});

module.exports = router;
