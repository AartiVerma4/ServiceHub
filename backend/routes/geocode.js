const express = require("express");
const router = express.Router();

// Simple in-memory cache for geocoding queries with a 24-hour TTL
const geocodeCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

router.get("/", async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ success: false, message: "Address query parameter is required." });
    }

    const trimmedAddress = address.trim().toLowerCase();

    // Check cache
    if (geocodeCache.has(trimmedAddress)) {
      const cached = geocodeCache.get(trimmedAddress);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Geocoding Cache Hit] Resolved: ${address}`);
        return res.json({ success: true, ...cached.data });
      } else {
        geocodeCache.delete(trimmedAddress); // Expired
      }
    }

    console.log(`[Geocoding Call] Requesting coordinates for: ${address}`);
    
    // Call OpenStreetMap Nominatim API (Free geocoding)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          "User-Agent": "ServiceHub-Platform-Development/1.0"
        }
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      // Fallback: If address not found, return default coords (New Delhi)
      // but inform the client it's a fallback.
      const fallbackResult = {
        lat: 28.6139,
        lng: 77.209,
        formattedAddress: address,
        isFallback: true,
        message: "Address coordinates not resolved. Falling back to default center."
      };
      return res.json({ success: true, ...fallbackResult });
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formattedAddress: data[0].display_name,
      isFallback: false
    };

    // Store in cache
    geocodeCache.set(trimmedAddress, {
      timestamp: Date.now(),
      data: result
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Geocoding API Error:", err);
    res.status(500).json({ success: false, message: "Geocoding service unavailable. Please enter coordinates manually." });
  }
});

module.exports = router;
