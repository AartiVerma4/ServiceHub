const express = require("express");
const router = express.Router();
const PushSubscription = require("../models/PushSubscription");
const webpush = require("web-push");
const { verifyToken } = require("../middleware/auth");

// Only configure VAPID if keys are set
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_FROM || "admin@servicehub.in"}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Subscribe
router.post("/subscribe", verifyToken, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    await PushSubscription.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, endpoint, keys },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: "Push notifications enabled." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving push subscription." });
  }
});

// Unsubscribe
router.delete("/unsubscribe", verifyToken, async (req, res) => {
  try {
    await PushSubscription.findOneAndDelete({ userId: req.user.id });
    res.json({ success: true, message: "Push notifications disabled." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing push subscription." });
  }
});

// Helper function to send push to a user
async function sendPushNotification(userId, title, body, url = "/bookings") {
  try {
    const sub = await PushSubscription.findOne({ userId });
    if (!sub || !process.env.VAPID_PUBLIC_KEY) {
      console.log(`[Push Mock] Would notify userId ${userId}: "${title}" — ${body}`);
      return;
    }
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify({ title, body, url })
    );
  } catch (err) {
    console.error("[Push Error]", err.message);
  }
}

module.exports = router;
module.exports.sendPushNotification = sendPushNotification;
