const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Provider = require("../models/Provider");
const { verifyToken, JWT_SECRET, REFRESH_SECRET } = require("../middleware/auth");

// Helper to create tokens
const generateTokens = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role, name: user.name };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// @route   POST /api/auth/signup
// @desc    Register a user (customer or provider)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "customer", phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Parse referral code if present
    let referredByUser = null;
    if (req.body.referralCode) {
      referredByUser = await User.findOne({ referralCode: req.body.referralCode });
    }

    const uniqueCode = "SH-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: ["customer", "provider", "admin"].includes(role) ? role : "customer",
      referralCode: uniqueCode,
      referredBy: referredByUser ? referredByUser._id : null
    });

    // If referred by someone, create a pending referral entry
    if (referredByUser) {
      const Referral = require("../models/Referral");
      await Referral.create({
        referrer: referredByUser._id,
        referee: newUser._id,
        status: "pending"
      });
    }

    // If role is provider, initialize Provider doc
    if (newUser.role === "provider") {
      await Provider.create({
        userId: newUser._id,
        kycStatus: "pending",
        bio: "Professional home service expert ready to deliver quality work.",
      });
    }

    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get tokens
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: "No account found with this email. Please sign up first." });
    }

    // Support both new passwordHash field and legacy password field
    const hashToCheck = user.passwordHash || user.password;
    if (!hashToCheck) {
      return res.status(400).json({ success: false, message: "Account issue detected. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, hashToCheck);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password. Please try again." });
    }

    // Migrate legacy user: copy password → passwordHash and save
    if (!user.passwordHash && user.password) {
      user.passwordHash = user.password;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash -refreshToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let providerData = null;
    if (user.role === "provider") {
      providerData = await Provider.findOne({ userId: user._id }).populate("skills");
    }

    res.json({
      success: true,
      user,
      provider: providerData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error fetching user details." });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Initiate password reset flow
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Security best practice: don't reveal if email doesn't exist
      return res.json({ success: true, message: "If an account matches that email, a reset link has been sent." });
    }

    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const { sendPasswordResetOTP } = require("../services/notificationService");

    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendPasswordResetOTP(user.email, resetUrl);

    res.json({ success: true, message: "If an account matches that email, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error initiating password reset." });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Complete password reset
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password are required." });
    }

    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated successfully! Please log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error resetting password." });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Issue new access token using refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token required." });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token." });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token." });
  }
});

module.exports = router;
