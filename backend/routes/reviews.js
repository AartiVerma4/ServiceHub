const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// @route   POST /api/reviews
// @desc    Submit a review (Only for completed bookings!)
router.post("/", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to review this booking." });
    }

    // Authenticity Check: Only completed bookings can leave a review!
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Authenticity Protection: You can only rate and review services after the job is completed.",
      });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ success: false, message: "This booking has already been reviewed." });
    }

    const firstServiceId = booking.services[0]?.service;
    const newReview = await Review.create({
      booking: booking._id,
      service: firstServiceId,
      customer: req.user.id,
      provider: booking.provider,
      rating: Number(rating),
      comment,
      verified: true,
    });

    booking.isReviewed = true;
    await booking.save();

    // Recalculate Service rating
    if (firstServiceId) {
      const allReviews = await Review.find({ service: firstServiceId });
      const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
      await Service.findByIdAndUpdate(firstServiceId, {
        "rating.average": parseFloat(avg.toFixed(1)),
        "rating.count": allReviews.length,
      });
    }

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to submit review." });
  }
});

// @route   GET /api/reviews/service/:serviceId
// @desc    Get all verified reviews for a service
router.get("/service/:serviceId", async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate("customer", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching service reviews." });
  }
});

module.exports = router;