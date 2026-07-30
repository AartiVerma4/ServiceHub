const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },
    isVerified: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    addresses: [
      {
        title: { type: String, default: "Home" },
        street: String,
        city: String,
        state: String,
        zip: String,
        lat: { type: Number, default: 28.6139 },
        lng: { type: Number, default: 77.209 },
        isDefault: { type: Boolean, default: false },
      },
    ],
    subscription: {
      isPlus: { type: Boolean, default: false },
      planName: { type: String, default: "Free" },
      expiresAt: Date,
      discountPercentage: { type: Number, default: 0 },
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
