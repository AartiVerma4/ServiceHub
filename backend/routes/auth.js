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

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: ["customer", "provider", "admin"].includes(role) ? role : "customer",
    });

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

module.exports = router;
