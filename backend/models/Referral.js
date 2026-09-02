const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReferralSchema = new Schema(
  {
    referrer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "completed", "rewarded"], default: "pending" },
    rewardCouponId: { type: Schema.Types.ObjectId, ref: "Coupon", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", ReferralSchema);
