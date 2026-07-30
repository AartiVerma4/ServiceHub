const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verified: { type: Boolean, default: true }, // verified booking check
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);