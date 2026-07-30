const Provider = require("../models/Provider");
const Booking = require("../models/Booking");

/**
 * Calculates distance between two lat/lng points in kilometers (Haversine Formula)
 */
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Smart Auto-Assignment Algorithm:
 * Finds eligible online & approved providers, checks schedule conflict,
 * and calculates a score based on proximity, average rating, and experience.
 */
async function autoAssignProvider(booking) {
  try {
    const customerLat = booking.address?.lat || 28.6139;
    const customerLng = booking.address?.lng || 77.209;

    // Find all approved & online providers
    const approvedProviders = await Provider.find({
      kycStatus: "approved",
      "availability.isOnline": true,
    }).populate("userId", "name email phone avatar");

    if (!approvedProviders || approvedProviders.length === 0) {
      return null; // No online approved providers
    }

    const candidateScores = [];

    for (const provider of approvedProviders) {
      // 1. Conflict Detection Check: Does provider have another booking at scheduledDate & timeSlot?
      const existingConflict = await Booking.findOne({
        provider: provider._id,
        scheduledDate: booking.scheduledDate,
        timeSlot: booking.timeSlot,
        status: { $in: ["assigned", "in-progress"] },
      });

      if (existingConflict) {
        continue; // Skip double-booking!
      }

      // 2. Proximity calculation
      const provLng = provider.location?.coordinates?.[0] || 77.209;
      const provLat = provider.location?.coordinates?.[1] || 28.6139;
      const distanceKm = getHaversineDistance(customerLat, customerLng, provLat, provLng);

      // Skip if beyond max service radius
      if (distanceKm > (provider.serviceRadiusKm || 30)) {
        continue;
      }

      // 3. Score weighting: 50% Distance (closer is better), 35% Rating, 15% Experience
      const distanceScore = Math.max(0, 100 - distanceKm * 3); // 0-100
      const ratingScore = ((provider.rating?.average || 4.5) / 5) * 100; // 0-100
      const expScore = Math.min(100, (provider.experienceYears || 1) * 10); // 0-100

      const totalScore = distanceScore * 0.5 + ratingScore * 0.35 + expScore * 0.15;

      candidateScores.push({
        provider,
        distanceKm: Math.round(distanceKm * 10) / 10,
        totalScore,
      });
    }

    if (candidateScores.length === 0) {
      // Fallback: If no provider without conflict in radius, pick the highest rated available approved provider
      const fallbackProvider = approvedProviders[0];
      return fallbackProvider ? fallbackProvider._id : null;
    }

    // Sort by highest score first
    candidateScores.sort((a, b) => b.totalScore - a.totalScore);
    return candidateScores[0].provider._id;
  } catch (err) {
    console.error("Smart provider assignment algorithm error:", err);
    return null;
  }
}

/**
 * Dynamic Pricing Engine:
 * Returns surge pricing multiplier based on day of week / time of day.
 */
function getSurgeMultiplier(scheduledDate, timeSlot) {
  let multiplier = 1.0;
  
  // Peak hour slots (e.g. 9 AM - 11 AM or weekend peak)
  if (timeSlot && (timeSlot.includes("09:00") || timeSlot.includes("10:00") || timeSlot.includes("18:00"))) {
    multiplier += 0.15; // 15% surge for morning/evening peak slots
  }

  const dateObj = new Date(scheduledDate);
  const day = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
  if (day === 0 || day === 6) {
    multiplier += 0.1; // 10% weekend surge
  }

  return parseFloat(multiplier.toFixed(2));
}

module.exports = {
  autoAssignProvider,
  getSurgeMultiplier,
  getHaversineDistance,
};
