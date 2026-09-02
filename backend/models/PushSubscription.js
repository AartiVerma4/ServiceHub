const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PushSubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PushSubscription", PushSubscriptionSchema);
