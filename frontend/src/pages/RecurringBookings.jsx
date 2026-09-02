import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { RefreshCw, PauseCircle, PlayCircle, XCircle, Calendar } from "lucide-react";

export default function RecurringBookings() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/recurring/my");
      if (res.data.success) setPlans(res.data.plans);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, isActive) => {
    try {
      await api.patch(`/recurring/${id}`, { isActive });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const freqLabel = { weekly: "Every Week", biweekly: "Every 2 Weeks", monthly: "Every Month" };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-400" /> Recurring Bookings
      </h1>
      <p className="text-slate-400 text-sm mb-8">Your active scheduled service subscriptions.</p>

      {loading ? (
        <div className="space-y-4">{[1,2].map(n => <div key={n} className="h-32 bg-slate-900/50 rounded-3xl animate-pulse" />)}</div>
      ) : plans.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-semibold">No recurring bookings yet.</p>
          <p className="text-slate-500 text-sm mt-1">You can set up recurring services at checkout (ServiceHub Plus feature).</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan._id} className={`glass-panel p-6 rounded-3xl border ${plan.isActive ? "border-indigo-500/20" : "border-slate-800 opacity-70"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>
                      {plan.isActive ? "Active" : "Paused"}
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold">{freqLabel[plan.frequency]}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {plan.services?.[0]?.service?.name || "Service Subscription"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.timeSlot} · {plan.address?.street}, {plan.address?.city}</p>
                  <p className="text-xs text-slate-500 mt-1">Next booking: <span className="text-white font-semibold">{plan.nextScheduledDate}</span></p>
                </div>
                <div className="flex gap-2">
                  {plan.isActive ? (
                    <button onClick={() => handleUpdate(plan._id, false)} className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">
                      <PauseCircle className="w-5 h-5" />
                    </button>
                  ) : (
                    <button onClick={() => handleUpdate(plan._id, true)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
                      <PlayCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleUpdate(plan._id, false)} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
