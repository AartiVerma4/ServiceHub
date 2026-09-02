const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => "SH-" + Math.floor(100000 + Math.random() * 900000),
    },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "Provider", default: null },
    services: [
      {
        service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
      },
    ],
    scheduledDate: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:00 AM - 11:00 AM"
    address: {
      title: { type: String, default: "Home" },
      street: String,
      city: String,
      zip: String,
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    providerLocation: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      surgeFee: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    couponCode: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    isReviewed: { type: Boolean, default: false },
    specialInstructions: { type: String, default: "" },
    refundId: { type: String, default: "" },
    refundAmount: { type: Number, default: 0 },
    refundedAt: { type: Date },
    walletAmountUsed: { type: Number, default: 0 },
    isRecurring: { type: Boolean, default: false },
    jobPhotos: [
      {
        type: { type: String, enum: ["before", "after"] },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: String }
      }
    ],
    sosAlerts: [
      {
        triggeredBy: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["customer", "provider"] },
        lat: { type: Number },
        lng: { type: Number },
        message: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
