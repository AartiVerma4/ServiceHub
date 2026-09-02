import React, { useEffect, useState } from "react";
import api from "../api";
import { ShoppingBag, Clock, MapPin, CheckCircle2, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  assigned: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "in-progress": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function UserServices() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => {
        if (res.data.success) setBookings(res.data.bookings.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No bookings yet.</p>
        <Link
          to="/services"
          className="mt-3 inline-block px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-indigo-400" /> Recent Bookings
      </h3>
      {bookings.map((b) => (
        <div key={b._id} className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {b.services?.map((s) => s.service?.name || "Service").join(", ") || "Booking"}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" /> {b.scheduledDate} · {b.timeSlot}
              </span>
              {b.address?.city && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3" /> {b.address.city}
                </span>
              )}
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap ${
              STATUS_COLORS[b.status] || "bg-slate-700 text-slate-300 border-slate-600"
            }`}
          >
            {b.status?.toUpperCase()}
          </span>
        </div>
      ))}
      <div className="text-center pt-2">
        <Link
          to="/bookings"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All Bookings →
        </Link>
      </div>
    </div>
  );
}
