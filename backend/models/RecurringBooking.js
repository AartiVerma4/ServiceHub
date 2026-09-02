const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecurringBookingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    services: [
      {
        service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true }
      }
    ],
    address: {
      title: { type: String, default: "Home" },
      street: String,
      city: String,
      zip: String,
      lat: { type: Number },
      lng: { type: Number }
    },
    timeSlot: { type: String, required: true },
    frequency: { type: String, enum: ["weekly", "biweekly", "monthly"], required: true },
    isActive: { type: Boolean, default: true },
    nextScheduledDate: { type: String, required: true } // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecurringBooking", RecurringBookingSchema);
