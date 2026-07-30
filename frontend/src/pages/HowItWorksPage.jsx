import React from "react";
import { Link } from "react-router-dom";
import {
  UserPlus, Search, CalendarCheck, Star,
  ShieldCheck, Clock, Award, Zap, ChevronRight,
  MessageSquare, MapPin, CreditCard
} from "lucide-react";

const STEPS = [
  {
    num: "01", icon: <UserPlus className="w-7 h-7 text-indigo-400" />,
    title: "Create Your Free Account",
    desc: "Sign up with your email in under 60 seconds. No credit card required to get started.",
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/20",
  },
  {
    num: "02", icon: <Search className="w-7 h-7 text-purple-400" />,
    title: "Browse & Select a Service",
    desc: "Explore 50+ verified home services. Filter by category, price, ratings, and your location.",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
  },
  {
    num: "03", icon: <CalendarCheck className="w-7 h-7 text-pink-400" />,
    title: "Pick Date, Slot & Address",
    desc: "Choose your preferred date and time slot. Enter your address — the pro comes to you.",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/20",
  },
  {
    num: "04", icon: <CreditCard className="w-7 h-7 text-amber-400" />,
    title: "Pay Securely via Razorpay",
    desc: "Safe, encrypted Razorpay checkout. Apply coupons for extra savings. Get an instant PDF invoice.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/20",
  },
  {
    num: "05", icon: <MapPin className="w-7 h-7 text-emerald-400" />,
    title: "Track Provider Live on Map",
    desc: "Watch your assigned professional en route in real-time. Get instant notifications on every status update.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
  },
  {
    num: "06", icon: <Star className="w-7 h-7 text-amber-400" />,
    title: "Rate Your Experience",
    desc: "After the job is done, leave a verified review. Your feedback helps us maintain quality across the platform.",
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/20",
  },
];

const FEATURES = [
  { icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />, title: "100% Verified Pros",    desc: "Every professional is background-checked, KYC-verified, and trained before going live." },
  { icon: <Clock className="w-6 h-6 text-indigo-400" />,        title: "Real-Time Tracking",   desc: "Track your provider live on the map and receive push notifications at each status change." },
  { icon: <Award className="w-6 h-6 text-amber-400" />,         title: "30-Day Guarantee",     desc: "Not satisfied? We re-do the service free of cost within 30 days — no questions asked." },
  { icon: <Zap className="w-6 h-6 text-purple-400" />,          title: "Smart Auto-Match",     desc: "Our algorithm instantly assigns the nearest, top-rated available professional for your booking." },
  { icon: <MessageSquare className="w-6 h-6 text-pink-400" />,  title: "In-App Live Chat",     desc: "Chat directly with your assigned provider without sharing personal phone numbers." },
  { icon: <CreditCard className="w-6 h-6 text-sky-400" />,      title: "Secure Payments",      desc: "256-bit encrypted Razorpay checkout with UPI, cards, wallets & net banking support." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-12 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-5">
            📖 Step-by-Step Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How ServiceHub Works
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            From search to service completion — a seamless, transparent experience in 6 simple steps.
          </p>
        </div>
      </div>

      {/* ── 6 Steps ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map(step => (
            <div
              key={step.num}
              className={`glass-card rounded-3xl p-6 border bg-gradient-to-br ${step.color} relative overflow-hidden group`}
            >
              {/* Step number watermark */}
              <span className="absolute top-4 right-5 text-5xl font-black text-white/5 select-none group-hover:text-white/10 transition-colors">
                {step.num}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white">Why Choose ServiceHub?</h2>
          <p className="text-slate-400 text-sm mt-2">We've thought of everything so you don't have to.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{f.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <div className="glass-panel rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready for Effortless Home Services?
          </h2>
          <p className="text-slate-400 text-sm mb-7 max-w-lg mx-auto">
            Book your first service today. Background-checked professionals arrive at your door — on time, every time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 hover:opacity-95 transition-all"
            >
              Explore Services <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
