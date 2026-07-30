const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Service = require("../models/Service");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const { getSurgeMultiplier } = require("../config/smartEngine");

// @route   GET /api/services/categories
// @desc    Get all active service categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ popularCount: -1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading categories." });
  }
});

// @route   GET /api/services
// @desc    Get all services with optional category, search, and dynamic pricing
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, scheduledDate, timeSlot } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const services = await Service.find(query).populate("categoryId");

    // Dynamic surge calculation if scheduledDate & timeSlot provided
    const surgeMultiplier = getSurgeMultiplier(scheduledDate || new Date(), timeSlot || "");

    const formattedServices = services.map((s) => {
      const currentPrice = Math.round(s.basePrice * surgeMultiplier);
      return {
        ...s.toObject(),
        surgeMultiplier,
        currentPrice,
        isSurgeActive: surgeMultiplier > 1.0,
      };
    });

    res.json({
      success: true,
      count: formattedServices.length,
      surgeMultiplier,
      services: formattedServices,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching services." });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service detail
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("categoryId");
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching service detail." });
  }
});

// @route   POST /api/services
// @desc    Create new service (Admin only)
router.post("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, category, basePrice, durationMinutes, description, includedFeatures, isPopular } = req.body;
    
    let categoryObj = await Category.findOne({ name: category });
    if (!categoryObj) {
      categoryObj = await Category.create({
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"),
      });
    }

    const newService = await Service.create({
      name,
      categoryId: categoryObj._id,
      category: categoryObj.name,
      basePrice: Number(basePrice),
      durationMinutes: Number(durationMinutes) || 60,
      description,
      includedFeatures: includedFeatures || ["Verified Technicians", "30-Day Guarantee"],
      isPopular: !!isPopular,
    });

    res.status(201).json({ success: true, service: newService });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create service." });
  }
});

module.exports = router;
