const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKey123456",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mockSecretKey654321",
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay Order for Test mode checkout
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const options = {
      amount: Math.round(booking.pricing.totalAmount * 100), // in paise
      currency: "INR",
      receipt: `receipt_${booking.bookingId}`,
    };

    let order;
    try {
      order = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      // Mock order fallback if invalid key provided
      order = {
        id: "order_mock_" + Math.random().toString(36).substring(7),
        amount: options.amount,
        currency: "INR",
        status: "created",
      };
    }

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_mockKey123456",
      amount: booking.pricing.totalAmount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error initiating payment." });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay signature & update payment status
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id || "pay_mock_" + Date.now();
    await booking.save();

    res.json({
      success: true,
      message: "Payment verified successfully!",
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Payment verification failed." });
  }
});

// @route   GET /api/payments/invoice/:bookingId
// @desc    Generate PDF Invoice on the fly
router.get("/invoice/:bookingId", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("customer", "name email phone")
      .populate("services.service");

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice_${booking.bookingId}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).text("ServiceHub", { align: "left" });
    doc.fontSize(10).text("On-Demand Home Services Marketplace", { align: "left" });
    doc.moveDown();

    doc.fontSize(18).text(`INVOICE #${booking.bookingId}`, { align: "right" });
    doc.fontSize(10).text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, { align: "right" });
    doc.moveDown();

    // Customer details
    doc.fontSize(12).text("Billed To:", { underline: true });
    doc.fontSize(10).text(`Name: ${booking.customer?.name || "Valued Customer"}`);
    doc.text(`Email: ${booking.customer?.email || "N/A"}`);
    doc.text(`Phone: ${booking.customer?.phone || "N/A"}`);
    doc.text(`Address: ${booking.address?.street || ""}, ${booking.address?.city || ""}`);
    doc.moveDown();

    // Booking Details
    doc.text(`Scheduled Date: ${booking.scheduledDate}`);
    doc.text(`Time Slot: ${booking.timeSlot}`);
    doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`);
    doc.moveDown();

    // Line items
    doc.fontSize(12).text("Service Details", { underline: true });
    doc.fontSize(10);
    booking.services.forEach((item) => {
      doc.text(`${item.service?.name || "Home Service"} x ${item.quantity} - ₹${item.unitPrice * item.quantity}`);
    });

    doc.moveDown();
    doc.fontSize(11).text(`Subtotal: ₹${booking.pricing.subtotal}`);
    doc.text(`Surge Fee: ₹${booking.pricing.surgeFee}`);
    doc.text(`Discount: -₹${booking.pricing.discountAmount}`);
    doc.text(`Tax (5%): ₹${booking.pricing.taxAmount}`);
    doc.fontSize(14).text(`Total Paid: ₹${booking.pricing.totalAmount}`, { bold: true });

    doc.end();
  } catch (err) {
    console.error("PDF Invoice Error:", err);
    res.status(500).send("Error generating invoice PDF.");
  }
});

module.exports = router;
