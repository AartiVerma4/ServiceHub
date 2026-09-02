const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");
const Service = require("../models/Service");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const { autoAssignProvider, getSurgeMultiplier } = require("../config/smartEngine");

// @route   POST /api/bookings
// @desc    Create new booking with conflict detection & auto-assignment
router.post("/", verifyToken, authorizeRoles("customer"), async (req, res) => {
  try {
    const { services, scheduledDate, timeSlot, address, couponCode, specialInstructions } = req.body;

    if (!services || services.length === 0 || !scheduledDate || !timeSlot || !address) {
      return res.status(400).json({ success: false, message: "Required booking details missing." });
    }

    // 1. Calculate pricing
    let subtotal = 0;
    const formattedServices = [];

    for (const item of services) {
      let dbService;
      try {
        dbService = await Service.findById(item.serviceId);
      } catch (castErr) {
        return res.status(400).json({ success: false, message: `Invalid service ID format: ${item.serviceId}. Please clear your cart and re-add services.` });
      }
      if (!dbService) {
        return res.status(404).json({ success: false, message: `Service not found (ID: ${item.serviceId}). Please clear your cart and re-add services from the catalogue.` });
      }
      const itemSub = dbService.basePrice * (item.quantity || 1);
      subtotal += itemSub;
      formattedServices.push({
        service: dbService._id,
        quantity: item.quantity || 1,
        unitPrice: dbService.basePrice,
      });
    }

    // 2. Dynamic Surge Pricing
    const surgeMultiplier = getSurgeMultiplier(scheduledDate, timeSlot);
    const surgeFee = Math.round(subtotal * (surgeMultiplier - 1.0));

    // 3. Coupon Discount calculation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date(coupon.expiresAt) > new Date() && subtotal >= coupon.minBookingAmount) {
        discountAmount = Math.min((subtotal * coupon.discountPercentage) / 100, coupon.maxDiscount);
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    // 4. Subscription check for ServiceHub Plus customer discount (10% extra off)
    const user = await User.findById(req.user.id);
    if (user && user.subscription?.isPlus) {
      discountAmount += Math.round(subtotal * 0.1);
    }

    const taxAmount = Math.round((subtotal + surgeFee - discountAmount) * 0.05); // 5% GST/Service tax
    const totalAmount = Math.max(0, subtotal + surgeFee - discountAmount + taxAmount);

    // 5. Create draft Booking
    const newBooking = new Booking({
      customer: req.user.id,
      services: formattedServices,
      scheduledDate,
      timeSlot,
      address,
      pricing: {
        subtotal,
        surgeFee,
        discountAmount,
        taxAmount,
        totalAmount,
      },
      couponCode: couponCode || "",
      specialInstructions: specialInstructions || "",
      status: "pending",
      statusHistory: [{ status: "pending", note: "Booking created, searching for nearest provider." }],
    });

    // 6. Smart Auto-Assignment Algorithm
    const assignedProviderId = await autoAssignProvider(newBooking);
    if (assignedProviderId) {
      newBooking.provider = assignedProviderId;
      newBooking.status = "assigned";
      newBooking.statusHistory.push({
        status: "assigned",
        note: "Verified service professional automatically assigned.",
      });

      // Notify via Socket.io if io instance is available
      const io = req.app.get("io");
      if (io) {
        io.emit(`provider_notification_${assignedProviderId}`, {
          type: "NEW_JOB",
          bookingId: newBooking._id,
          message: "You have been assigned a new home service booking!",
        });
      }
    }

    await newBooking.save();
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("services.service")
      .populate({ path: "provider", populate: { path: "userId", select: "name phone avatar" } });

    // Send Booking Confirmation Notification (Async)
    const { sendBookingConfirmation, sendProviderAssigned, sendStatusUpdate, sendRefundInitiated } = require("../services/notificationService");
    sendBookingConfirmation(populatedBooking, user).catch(err => console.error("Error sending booking confirmation notif:", err));

    if (assignedProviderId && populatedBooking.provider?.userId) {
      sendProviderAssigned(populatedBooking, user, populatedBooking.provider.userId).catch(err => console.error("Error sending provider assignment notif:", err));
    }

    res.status(201).json({
      success: true,
      booking: populatedBooking,
      message: assignedProviderId
        ? "Booking confirmed! Provider assigned."
        : "Booking received! Matching with nearby provider.",
    });
  } catch (err) {
    console.error("Create booking error:", err.message);
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid service ID in cart. Please clear your cart and re-add services." });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ success: false, message: `Booking validation failed: ${messages}` });
    }
    res.status(500).json({ success: false, message: "Error creating booking. Please try again." });
  }
});

// @route   GET /api/bookings/my
// @desc    Get bookings for logged-in user (Customer or Provider)
router.get("/my", verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "customer") {
      query.customer = req.user.id;
    } else if (req.user.role === "provider") {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider) {
        return res.json({ success: true, count: 0, bookings: [] });
      }
      query.provider = provider._id;
    } else {
      // Admin gets all
    }

    const bookings = await Booking.find(query)
      .populate("services.service")
      .populate("customer", "name email phone avatar")
      .populate({ path: "provider", populate: { path: "userId", select: "name phone avatar" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching bookings." });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("services.service")
      .populate("customer", "name email phone avatar")
      .populate({ path: "provider", populate: { path: "userId", select: "name phone avatar" } });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Only allow customer, assigned provider, or admin to view
    const isCustomer = booking.customer?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isCustomer && !isAdmin) {
      const provider = await Provider.findOne({ userId: req.user.id });
      if (!provider || booking.provider?._id?.toString() !== provider._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized to view this booking." });
      }
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching booking." });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (provider / admin / customer cancellation)
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone avatar")
      .populate({ path: "provider", populate: { path: "userId", select: "name phone avatar" } });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const validStatuses = ["pending", "assigned", "in-progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const oldStatus = booking.status;
    booking.status = status;
    booking.statusHistory.push({ status, note: note || `Status updated to ${status}` });

    // Handle Cancellation Refund Logic
    if (status === "cancelled" && oldStatus !== "cancelled") {
      if (booking.paymentStatus === "paid") {
        // Calculate Refund (100% if >24h, 50% if 2-24h, 0% otherwise)
        const scheduledDateTime = new Date(`${booking.scheduledDate} ${booking.timeSlot.split(" - ")[0]}`);
        const hoursDiff = (scheduledDateTime - new Date()) / (1000 * 60 * 60);

        let refundPercentage = 0;
        if (hoursDiff > 24) {
          refundPercentage = 1.0;
        } else if (hoursDiff >= 2) {
          refundPercentage = 0.5;
        }

        const refundAmount = Math.round(booking.pricing.totalAmount * refundPercentage);

        if (refundAmount > 0) {
          try {
            const Razorpay = require("razorpay");
            const razorpayInstance = new Razorpay({
              key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKey123456",
              key_secret: process.env.RAZORPAY_KEY_SECRET || "mockSecretKey654321",
            });

            // Trigger Razorpay Refund API
            let refundResponse;
            if (process.env.RAZORPAY_KEY_ID) {
              refundResponse = await razorpayInstance.payments.refund(booking.razorpayPaymentId, {
                amount: refundAmount * 100, // paise
              });
              booking.refundId = refundResponse.id;
            } else {
              booking.refundId = "ref_mock_" + Math.random().toString(36).substring(7);
            }

            booking.paymentStatus = "refunded";
            booking.refundAmount = refundAmount;
            booking.refundedAt = new Date();

            const { sendRefundInitiated } = require("../services/notificationService");
            sendRefundInitiated(booking, booking.customer, refundAmount).catch(err => console.error("Error sending refund notification:", err));
          } catch (refundErr) {
            console.error("Razorpay Refund Error:", refundErr);
            // Don't fail the cancellation response but log error
          }
        }
      }
    }

    if (status === "completed") {
      booking.paymentStatus = "paid";
      // Update provider earnings
      if (booking.provider) {
        const provider = await Provider.findById(booking.provider);
        if (provider) {
          provider.earnings.total += booking.pricing.totalAmount;
          provider.earnings.completedJobsCount += 1;
          await provider.save();
        }
      }
    }

    await booking.save();

    // Trigger Notification
    const { sendStatusUpdate } = require("../services/notificationService");
    sendStatusUpdate(booking, booking.customer, status).catch(err => console.error("Error sending status update notification:", err));

    // Trigger Socket.io real-time update
    const io = req.app.get("io");
    if (io) {
      io.to(`booking_${booking._id}`).emit("booking_status_updated", {
        bookingId: booking._id,
        status: booking.status,
        note: note || `Booking status updated to ${status}`,
      });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Failed to update booking status:", err);
    res.status(500).json({ success: false, message: "Failed to update booking status." });
  }
});

// @route   POST /api/bookings/:id/sos
// @desc    Trigger SOS safety alert (customer or provider)
router.post("/:id/sos", verifyToken, async (req, res) => {
  try {
    const { message, lat, lng } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    const alertPayload = {
      triggeredBy: req.user.id,
      role: req.user.role,
      lat: lat || null,
      lng: lng || null,
      message: message || "SOS Alert triggered!",
      timestamp: new Date(),
      resolved: false
    };

    booking.sosAlerts.push(alertPayload);
    await booking.save();

    // Emit to admin room via Socket.io
    const io = req.app.get("io");
    if (io) {
      io.to("admin_room").emit("sos_alert", {
        bookingId: booking._id,
        bookingRef: booking.bookingId,
        triggeredBy: req.user.id,
        role: req.user.role,
        message: alertPayload.message,
        timestamp: alertPayload.timestamp
      });
    }

    res.json({ success: true, message: "SOS alert sent to admin. Help is on the way." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending SOS alert." });
  }
});

module.exports = router;
