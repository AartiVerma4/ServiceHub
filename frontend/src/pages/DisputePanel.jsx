import React, { useState, useEffect } from "react";
import api from "../api";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function DisputePanel() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState({});

  useEffect(() => { fetchDisputes(); }, []);

  const fetchDisputes = async () => {
    try {
      const res = await api.get("/disputes/admin");
      if (res.data.success) setDisputes(res.data.disputes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleResolve = async (id, status) => {
    try {
      await api.patch(`/disputes/admin/${id}`, { status, resolution: resolution[id] || "Resolved by admin." });
      fetchDisputes();
    } catch (err) { alert("Error resolving dispute."); }
  };

  const statusColor = (s) => ({
    open: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    under_review: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    resolved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    rejected: "bg-slate-700 text-slate-400 border-slate-600",
  })[s] || "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-rose-400" /> Dispute Resolution Panel
      </h1>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(n => <div key={n} className="h-32 bg-slate-900/50 rounded-3xl animate-pulse" />)}</div>
      ) : disputes.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-semibold">No open disputes — all clear!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((d) => (
            <div key={d._id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor(d.status)}`}>
                      {d.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{d._id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white capitalize">{d.category?.replace("_", " ")}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">{d.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">Raised by</p>
                  <p className="text-sm font-semibold text-white">{d.raisedBy?.name || "Customer"}</p>
                  <p className="text-xs text-slate-400">{d.raisedBy?.email}</p>
                </div>
              </div>

              {d.booking && (
                <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-500">Booking: </span>
                  <span className="text-white font-mono">{d.booking.bookingId || d.booking._id}</span>
                  {d.booking.customer && (
                    <span className="ml-4">Customer: <span className="text-white">{d.booking.customer.name}</span></span>
                  )}
                </div>
              )}

              {d.status === "open" || d.status === "under_review" ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={resolution[d._id] || ""}
                    onChange={e => setResolution(prev => ({ ...prev, [d._id]: e.target.value }))}
                    placeholder="Enter resolution note..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button onClick={() => handleResolve(d._id, "resolved")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs">
                    ✓ Resolve
                  </button>
                  <button onClick={() => handleResolve(d._id, "rejected")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-xs">
                    ✗ Reject
                  </button>
                </div>
              ) : (
                d.resolution && (
                  <p className="text-xs text-slate-400 italic">Resolution: {d.resolution}</p>
                )
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Clock className="w-3 h-3" />
                {new Date(d.createdAt).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
