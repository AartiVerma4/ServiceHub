const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    category: { type: String, required: true }, // string fallback
    subCategory: { type: String, default: "General" },
    basePrice: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1.0 },
    durationMinutes: { type: Number, default: 60 },
    description: { type: String, required: true },
    includedFeatures: [{ type: String }],
    images: [{ type: String }],
    rating: {
      average: { type: Number, default: 4.9 },
      count: { type: Number, default: 24 },
    },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
