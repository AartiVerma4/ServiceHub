const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DisputeSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    raisedByRole: { type: String, enum: ["customer", "provider"], required: true },
    category: {
      type: String,
      enum: ["service_quality", "no_show", "safety_concern", "overcharged", "other"],
      required: true
    },
    description: { type: String, required: true },
    evidence: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open"
    },
    resolution: { type: String, default: "" },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", DisputeSchema);
