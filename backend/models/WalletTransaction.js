const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    points: { type: Number, default: 0 },
    description: { type: String, default: "" },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
