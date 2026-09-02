const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const { verifyToken } = require("../middleware/auth");

// Get balance & transactions
router.get("/my", verifyToken, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user.id, balance: 100 }); // give free 100 on first check
      await WalletTransaction.create({
        walletId: wallet._id,
        type: "credit",
        amount: 100,
        points: 100,
        description: "Welcome loyalty bonus credit!"
      });
    }

    const transactions = await WalletTransaction.find({ walletId: wallet._id }).sort({ createdAt: -1 });
    res.json({ success: true, balance: wallet.balance, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching wallet profile." });
  }
});

module.exports = router;
