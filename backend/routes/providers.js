const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");
const User = require("../models/User");
const Booking = require("../models/Booking");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// @route   POST /api/providers/kyc
// @desc    Upload / submit KYC documents (Provider)
router.post("/kyc", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const { docType, url, bio, experienceYears } = req.body;
    let provider = await Provider.findOne({ userId: req.user.id });

    if (!provider) {
      provider = new Provider({ userId: req.user.id });
    }

    if (bio) provider.bio = bio;
    if (experienceYears) provider.experienceYears = Number(experienceYears);
    if (url) {
      provider.kycDocs.push({ docType: docType || "Government ID", url });
    }
    provider.kycStatus = "pending"; // awaits admin approval
    await provider.save();

    res.json({ success: true, message: "KYC documents submitted for admin review.", provider });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit KYC documents." });
  }
});

// @route   PATCH /api/providers/toggle-online
// @desc    Toggle provider online/offline status
router.patch("/toggle-online", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider profile not found." });
    }

    provider.availability.isOnline = !provider.availability.isOnline;
    await provider.save();

    res.json({ success: true, isOnline: provider.availability.isOnline });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status." });
  }
});

// @route   GET /api/providers/dashboard
// @desc    Get provider earnings dashboard & metrics
router.get("/dashboard", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider profile not found." });
    }

    const assignedJobs = await Booking.find({ provider: provider._id })
      .populate("customer", "name email phone avatar")
      .populate("services.service")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      provider,
      earnings: provider.earnings,
      jobsCount: assignedJobs.length,
      assignedJobs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading provider metrics." });
  }
});

// @route   PATCH /api/providers/bank-account
// @desc    Update bank account details (Provider)
router.patch("/bank-account", verifyToken, authorizeRoles("provider"), async (req, res) => {
  try {
    const { accountNumber, ifscCode } = req.body;
    if (!accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: "Account number and IFSC are required." });
    }

    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found." });
    }

    provider.bankAccount = { accountNumber, ifscCode, razorpayFundAccountId: "fa_mock_" + Math.random().toString(36).substring(7) };
    await provider.save();

    res.json({ success: true, message: "Bank account updated successfully.", bankAccount: provider.bankAccount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to link bank account." });
  }
});

module.exports = router;
