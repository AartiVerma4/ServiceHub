const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercentage: { type: Number, required: true },
    maxDiscount: { type: Number, default: 500 },
    minBookingAmount: { type: Number, default: 299 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
