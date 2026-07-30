import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { DollarSign, Briefcase, CheckCircle2, ShieldAlert, ToggleLeft, ToggleRight, MapPin, Play, Check } from "lucide-react";

export default function ProviderDashboard() {
  const [provider, setProvider] = useState(null);
  const [earnings, setEarnings] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { socket } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/providers/dashboard");
      if (res.data.success) {
        setProvider(res.data.provider);
        setEarnings(res.data.earnings);
        setJobs(res.data.assignedJobs);
      }
    } catch (err) {
      console.error("Error loading provider metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const res = await api.patch("/providers/toggle-online");
      if (res.data.success) {
        setProvider((prev) => ({
          ...prev,
          availability: { ...prev.availability, isOnline: res.data.isOnline },
        }));
      }
    } catch (err) {
      console.error("Toggle online error:", err);
    }
  };

  const updateJobStatus = async (bookingId, status) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        fetchDashboard();
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-10 text-center">Loading Provider Workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Status */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Provider Workstation</h1>
            {provider?.kycStatus === "approved" ? (
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">KYC Verified</span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">KYC Pending Review</span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage assigned jobs, update status & view earnings history</p>
        </div>

        {/* Online Toggle */}
        <button
          onClick={toggleOnlineStatus}
          className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
            provider?.availability?.isOnline
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {provider?.availability?.isOnline ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
          {provider?.availability?.isOnline ? "Online & Ready For Jobs" : "Offline"}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <DollarSign className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-xs text-slate-400 font-semibold">Total Revenue Earned</p>
          <h2 className="text-3xl font-black text-white mt-1">₹{earnings?.total || 0}</h2>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <Briefcase className="w-8 h-8 text-indigo-400 mb-2" />
          <p className="text-xs text-slate-400 font-semibold">Jobs Completed</p>
          <h2 className="text-3xl font-black text-white mt-1">{earnings?.completedJobsCount || 0}</h2>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <CheckCircle2 className="w-8 h-8 text-pink-400 mb-2" />
          <p className="text-xs text-slate-400 font-semibold">Average Customer Rating</p>
          <h2 className="text-3xl font-black text-white mt-1">{provider?.rating?.average || 4.9} ★</h2>
        </div>
      </div>

      {/* Assigned Jobs Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white">Assigned Service Jobs ({jobs.length})</h2>

        {jobs.length === 0 ? (
          <p className="text-slate-400 text-sm">No active jobs assigned at the moment.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{job.bookingId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                      {job.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1">{job.services?.[0]?.service?.name}</h3>
                  <p className="text-xs text-slate-400">Customer: {job.customer?.name} ({job.customer?.phone})</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {job.address?.street}, {job.address?.city}
                  </p>
                </div>

                {/* Job State Triggers */}
                <div className="flex items-center gap-2">
                  {job.status === "assigned" && (
                    <button
                      onClick={() => updateJobStatus(job._id, "in-progress")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Job
                    </button>
                  )}
                  {job.status === "in-progress" && (
                    <button
                      onClick={() => updateJobStatus(job._id, "completed")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
