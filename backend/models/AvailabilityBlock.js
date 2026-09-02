const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvailabilityBlockSchema = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startHour: { type: Number, default: 0 },
    endHour: { type: Number, default: 24 },
    reason: { type: String, default: "Unavailable" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvailabilityBlock", AvailabilityBlockSchema);
