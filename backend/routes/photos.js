const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth");

// Configure local multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload before/after photo
router.post("/:id/photos", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const { type } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    booking.jobPhotos.push({
      type,
      url: photoUrl,
      uploadedBy: req.user.role
    });

    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error uploading photo." });
  }
});

module.exports = router;
