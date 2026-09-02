import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import { Gift, Copy, CheckCircle2, Users, Award } from "lucide-react";

export default function ReferralPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralCode = user?.referralCode || "LOADING";
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  useEffect(() => {
    api.get("/referrals/my")
      .then(r => { if (r.data.success) setReferrals(r.data.referrals); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rewarded = referrals.filter(r => r.status === "rewarded").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
        <Gift className="w-8 h-8 text-pink-400" /> Refer & Earn
      </h1>
      <p className="text-slate-400 text-sm mb-8">Share ServiceHub and earn ₹200 coupon for every friend who books their first service.</p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <Users className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-white">{referrals.length}</h3>
          <p className="text-xs text-slate-400 font-semibold">Friends Referred</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-white">{rewarded}</h3>
          <p className="text-xs text-slate-400 font-semibold">Successful Bookings</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <Award className="w-7 h-7 text-amber-400 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-white">₹{rewarded * 200}</h3>
          <p className="text-xs text-slate-400 font-semibold">Total Earned</p>
        </div>
      </div>

      {/* Share Card */}
      <div className="glass-panel p-6 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 via-slate-900 to-slate-900 mb-8">
        <h2 className="text-lg font-bold text-white mb-1">Your Unique Referral Code</h2>
        <p className="text-xs text-slate-400 mb-4">Share this link or code with friends. You both get rewarded!</p>

        {/* Code Box */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-slate-900 border border-pink-500/30 rounded-xl px-4 py-3">
            <p className="text-lg font-mono font-black text-pink-400 tracking-widest">{referralCode}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${copied ? "bg-emerald-600 text-white" : "bg-pink-600 hover:bg-pink-500 text-white"}`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <div className="text-xs text-slate-500 break-all font-mono bg-slate-900/60 px-3 py-2 rounded-lg">
          {referralLink}
        </div>
      </div>

      {/* Referral History Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">Referral History</h2>
        {loading ? (
          <div className="space-y-3">{[1,2].map(n => <div key={n} className="h-12 bg-slate-900/50 rounded-xl animate-pulse" />)}</div>
        ) : referrals.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No referrals yet. Start sharing your link!</p>
        ) : (
          <div className="space-y-3">
            {referrals.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="text-sm font-bold text-white">{r.referee?.name || "Friend"}</p>
                  <p className="text-xs text-slate-400">{r.referee?.email}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  r.status === "rewarded" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                  r.status === "completed" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" :
                  "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {r.status === "rewarded" ? "✓ Rewarded" : r.status === "completed" ? "Booked" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
