import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "../api";
import { User, Mail, Phone, Save, CheckCircle2, ShoppingBag, Wallet, Gift, RefreshCw } from "lucide-react";

export default function UserDashboard() {
  const { user, login, token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setErr("");
    try {
      const res = await api.patch("/user/profile", { name, phone });
      if (res.data.success) {
        setMsg("Profile updated successfully!");
        // Update the user in auth context
        login(token, { ...user, name, phone });
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const quickLinks = [
    { to: "/bookings", icon: ShoppingBag, label: "My Bookings", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { to: "/wallet", icon: Wallet, label: "Loyalty Wallet", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { to: "/referral", icon: Gift, label: "Refer & Earn", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
    { to: "/recurring", icon: RefreshCw, label: "Recurring Plans", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 text-3xl font-black text-white">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-black text-white">{user.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
            {user.role}
          </span>
          {user.subscription?.isPlus && (
            <span className="inline-block mt-2 ml-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⭐ ServiceHub Plus
            </span>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`glass-panel rounded-2xl p-4 border flex flex-col items-center gap-2 hover:scale-105 transition-transform ${link.bg}`}
            >
              <link.icon className={`w-6 h-6 ${link.color}`} />
              <span className="text-xs font-semibold text-slate-300 text-center">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Edit Profile Form */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Edit Profile
          </h2>

          {msg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {msg}
            </div>
          )}
          {err && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {err}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Referral Code */}
        {user.referralCode && (
          <div className="glass-panel rounded-3xl p-6 border border-pink-500/20 bg-gradient-to-br from-pink-950/30 to-slate-900">
            <h2 className="text-sm font-bold text-pink-300 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4" /> Your Referral Code
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white tracking-widest">{user.referralCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode);
                  setMsg("Referral code copied to clipboard!");
                  setTimeout(() => setMsg(""), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition-all"
              >
                Copy
              </button>
            </div>
            <p className="text-slate-400 text-xs mt-2">Share this code with friends. Both you and your friend earn wallet credits when they complete their first booking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
