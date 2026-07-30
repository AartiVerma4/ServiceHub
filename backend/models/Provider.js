const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProviderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    experienceYears: { type: Number, default: 2 },
    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    kycDocs: [
      {
        docType: { type: String, default: "ID Proof" },
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    skills: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    rating: {
      average: { type: Number, default: 4.8 },
      count: { type: Number, default: 12 },
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [77.209, 28.6139] }, // [lng, lat]
    },
    serviceRadiusKm: { type: Number, default: 25 },
    availability: {
      isOnline: { type: Boolean, default: true },
      workingDays: [{ type: String, default: "Monday" }],
      startHour: { type: Number, default: 9 }, // 9 AM
      endHour: { type: Number, default: 20 }, // 8 PM
    },
    earnings: {
      total: { type: Number, default: 0 },
      pendingPayout: { type: Number, default: 0 },
      completedJobsCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ProviderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Provider", ProviderSchema);
