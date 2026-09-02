import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import { ShoppingBag, Trash2, Calendar, Clock, MapPin, Tag, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function CartBooking() {
  const { cart, removeFromCart, clearCart, user } = useAuth();
  const navigate = useNavigate();

  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:00 AM");
  const [addressTitle, setAddressTitle] = useState("Home");
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || "Connaught Place, Block B");
  const [city, setCity] = useState(user?.addresses?.[0]?.city || "New Delhi");
  const [zip, setZip] = useState("110001");

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState("");
  const [couponError, setCouponError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.service.currentPrice || item.service.basePrice) * item.quantity,
    0
  );

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME50") {
      const disc = Math.min(subtotal * 0.5, 300);
      setAppliedDiscount(disc);
      setCouponSuccess("50% OFF Coupon Applied! Saved ₹" + disc);
      setCouponError("");
    } else if (couponCode.toUpperCase() === "FESTIVE20") {
      const disc = Math.min(subtotal * 0.2, 500);
      setAppliedDiscount(disc);
      setCouponSuccess("20% FESTIVE Coupon Applied! Saved ₹" + disc);
      setCouponError("");
    } else {
      setCouponError("Invalid promo code. Try WELCOME50 or FESTIVE20");
      setCouponSuccess("");
    }
  };

  const [bookingError, setBookingError] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);
    setBookingError("");
    try {
      const bookingPayload = {
        services: cart.map((item) => ({
          serviceId: item.service._id,
          quantity: item.quantity,
        })),
        scheduledDate,
        timeSlot,
        address: {
          title: addressTitle,
          street,
          city,
          zip,
          lat: window.latestGeocodedCoords?.lat || 28.6315,
          lng: window.latestGeocodedCoords?.lng || 77.2167,
        },
        couponCode,
      };

      const res = await api.post("/bookings", bookingPayload);

      if (res.data.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        clearCart();
        navigate("/bookings");
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      // Stale cart IDs (server restart / memory DB reset) — offer to refresh
      if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("invalid service id") || msg.toLowerCase().includes("clear your cart")) {
        setBookingError("Your cart contains outdated service items (the server may have restarted). Please clear your cart and re-add services.");
      } else {
        setBookingError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Service Cart is Empty</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Browse our categories and add expert home services to schedule your appointment.
        </p>
        <Link
          to="/services"
          className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-8">Checkout & Schedule Slot</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Services & Schedule/Address Picker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Services */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Selected Services ({cart.length})</span>
              <button onClick={clearCart} className="text-xs text-rose-400 hover:underline">Clear All</button>
            </h2>

            <div className="divide-y divide-slate-800">
              {cart.map(({ service, quantity }) => (
                <div key={service._id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-base">{service.name}</h3>
                    <p className="text-xs text-slate-400">{service.category} • {service.durationMinutes} mins</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-indigo-400">₹{(service.currentPrice || service.basePrice) * quantity}</span>
                    <button
                      onClick={() => removeFromCart(service._id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Slot Picker */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Choose Date & Time Slot
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Service Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Preferred Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                >
                  <option>09:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>05:00 PM - 06:00 PM</option>
                  <option>07:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" /> Service Address
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                  />
                </div>
              </div>

              {/* Geocoding Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!street || !city) return alert("Please fill street and city first.");
                    try {
                      const fullAddress = `${street}, ${city}, ${zip}`;
                      const res = await api.get(`/geocode?address=${encodeURIComponent(fullAddress)}`);
                      if (res.data.success) {
                        alert(`Address verified & located! (Lat: ${res.data.lat.toFixed(4)}, Lng: ${res.data.lng.toFixed(4)})`);
                        // Store the coordinates for the submit call
                        window.latestGeocodedCoords = { lat: res.data.lat, lng: res.data.lng };
                      }
                    } catch (e) {
                      console.error("Geocoding failed", e);
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 font-bold text-xs rounded-xl"
                >
                  📍 Locate & Verify Address on Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Payment Summary</h2>

            {/* Coupon Code Input */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Apply Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-xl text-indigo-400"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && <p className="text-xs text-emerald-400 font-medium mt-1">{couponSuccess}</p>}
              {couponError && <p className="text-xs text-rose-400 font-medium mt-1">{couponError}</p>}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span>₹{Math.round(subtotal * 0.05)}</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-white">
                <span className="text-base font-bold">Total Payable</span>
                <span className="text-2xl font-black text-gradient">
                  ₹{Math.max(0, subtotal - appliedDiscount + Math.round(subtotal * 0.05))}
                </span>
              </div>
            </div>

            {/* Booking Error Banner */}
            {bookingError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-3">
                <p className="font-bold">⚠️ Booking Failed</p>
                <p>{bookingError}</p>
                <button
                  onClick={() => { clearCart(); navigate("/services"); }}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Clear Cart &amp; Browse Services Again
                </button>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Confirming Booking..." : "Confirm & Pay via Razorpay"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
