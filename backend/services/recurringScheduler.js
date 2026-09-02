const cron = require("node-cron");
const RecurringBooking = require("../models/RecurringBooking");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

/**
 * Computes the next scheduled date given a frequency
 */
function getNextDate(dateStr, frequency) {
  const date = new Date(dateStr + "T00:00:00");
  switch (frequency) {
    case "weekly":    date.setDate(date.getDate() + 7); break;
    case "biweekly":  date.setDate(date.getDate() + 14); break;
    case "monthly":   date.setMonth(date.getMonth() + 1); break;
  }
  return date.toISOString().split("T")[0];
}

/**
 * Recurring Booking Scheduler — runs once daily at 6:00 AM
 */
function startRecurringScheduler() {
  cron.schedule("0 6 * * *", async () => {
    const today = new Date().toISOString().split("T")[0];
    console.log(`[Recurring Scheduler] Checking for due recurring bookings on ${today}...`);

    try {
      const dueBookings = await RecurringBooking.find({
        isActive: true,
        nextScheduledDate: { $lte: today }
      }).populate("services.service");

      console.log(`[Recurring Scheduler] Found ${dueBookings.length} due recurring plan(s).`);

      for (const plan of dueBookings) {
        try {
          // Build service list for booking
          const services = plan.services.map(s => ({
            service: s.service._id,
            quantity: s.quantity,
            unitPrice: s.unitPrice
          }));

          const subtotal = services.reduce((acc, s) => acc + s.unitPrice * s.quantity, 0);

          // Create new Booking from recurring plan
          const newBooking = new Booking({
            customer: plan.customer,
            services,
            scheduledDate: plan.nextScheduledDate,
            timeSlot: plan.timeSlot,
            address: plan.address,
            pricing: {
              subtotal,
              surgeFee: 0,
              discountAmount: 0,
              taxAmount: Math.round(subtotal * 0.05),
              totalAmount: subtotal + Math.round(subtotal * 0.05)
            },
            isRecurring: true,
            status: "pending",
            statusHistory: [{ status: "pending", note: "Auto-created from recurring plan." }]
          });

          await newBooking.save();

          // Advance next scheduled date
          plan.nextScheduledDate = getNextDate(plan.nextScheduledDate, plan.frequency);
          await plan.save();

          console.log(`[Recurring Scheduler] Created booking ${newBooking.bookingId} for customer ${plan.customer} (next: ${plan.nextScheduledDate})`);
        } catch (err) {
          console.error(`[Recurring Scheduler] Error creating booking for plan ${plan._id}:`, err.message);
        }
      }
    } catch (err) {
      console.error("[Recurring Scheduler] Error:", err.message);
    }
  });

  console.log("[Recurring Scheduler] Started — runs daily at 6:00 AM.");
}

module.exports = { startRecurringScheduler };
