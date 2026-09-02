import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Sparkles, ShieldCheck, Clock, Award, Star, Zap, ChevronRight,
  CheckCircle2, ThumbsUp, ArrowRight, UserCheck, HeartHandshake, PhoneCall
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, lang } = useAuth();

  const categories = [
    { title: lang === "hi" ? "सलून और स्पा" : "Salon & Spa", icon: "✨", count: "12+ Services", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" },
    { title: lang === "hi" ? "सफाई और स्वच्छता" : "Cleaning & Sanitization", icon: "🧹", count: "8+ Services", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80" },
    { title: lang === "hi" ? "एसी और मरम्मत" : "AC & Appliance Repair", icon: "❄️", count: "15+ Services", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" },
    { title: lang === "hi" ? "प्लंबिंग सेवाएं" : "Plumbing Services", icon: "🔧", count: "10+ Services", img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80" },
    { title: lang === "hi" ? "इलेक्ट्रीशियन सेवाएं" : "Electrician Services", icon: "⚡", count: "14+ Services", img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80" },
    { title: lang === "hi" ? "पेस्ट कंट्रोल" : "Pest Control", icon: "🛡️", count: "6+ Services", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
  ];

  const trendingServices = [
    { id: "t1", name: "Full Home Deep Cleaning", price: 1499, rating: 4.9, reviews: 312, duration: "180 mins", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80", category: "Cleaning" },
    { id: "t2", name: "AC Power Jet Wash", price: 499, rating: 4.9, reviews: 428, duration: "45 mins", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", category: "AC Repair" },
    { id: "t3", name: "Luxury Salon Facial & Glow", price: 799, rating: 4.8, reviews: 245, duration: "60 mins", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", category: "Salon & Spa" },
    { id: "t4", name: "Cockroach & Ant Pest Control", price: 899, rating: 4.8, reviews: 276, duration: "50 mins", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", category: "Pest Control" },
  ];

  const stats = [
    { number: "2.5M+", label: "Happy Customers Served" },
    { number: "45,000+", label: "Verified Technicians" },
    { number: "4.8 / 5", label: "Average Service Rating" },
    { number: "30 Mins", label: "Average Arrival Time" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* ── 1. Hero Section ───────────────────────────────────── */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xl">
            <Sparkles className="w-4 h-4 text-indigo-400" /> India's Most Trusted Home Services Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Expert Home Services <br />
            <span className="text-gradient">Delivered To Your Doorstep</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            Book verified background-checked experts for cleaning, AC repair, salon, plumbing & electrical fixes in under 60 seconds.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
            <div className="glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2">
              <Search className="w-6 h-6 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search AC repair, salon facial, home cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-slate-100 placeholder-slate-400 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-all whitespace-nowrap flex items-center gap-2"
              >
                Search <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> 100% Background Checked
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> 30-Min Express Arrival
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-400" /> 30-Day Money-Back Guarantee
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Live Platform Stats Bar ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-black text-white">{s.number}</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Visual Categories Grid ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Popular Categories</h2>
            <p className="text-slate-400 text-sm mt-1">Explore our most requested home service solutions</p>
          </div>
          <Link to="/services" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/services?category=${encodeURIComponent(cat.title)}`}
              className="glass-card rounded-3xl border border-slate-800 overflow-hidden group hover:scale-[1.02] transition-all flex flex-col h-64 relative"
            >
              <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="relative z-10 p-6 mt-auto">
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{cat.title}</h3>
                <p className="text-slate-300 text-xs mt-1 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Trending & Most Booked Services ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Top Recommendations</span>
            <h2 className="text-3xl font-extrabold text-white">Trending Services This Week</h2>
          </div>
          <Link to="/services" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm flex items-center gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingServices.map((service) => (
            <div key={service.id} className="glass-card rounded-3xl border border-slate-800 overflow-hidden flex flex-col group">
              <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                <img src={service.img} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-slate-700">
                  {service.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{service.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-500/20 flex-shrink-0">
                    <Star className="w-3 h-3 fill-amber-300" /> {service.rating}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4">{service.duration} • {service.reviews} reviews</p>
                <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Starts at</span>
                    <span className="text-xl font-black text-white">₹{service.price}</span>
                  </div>
                  <Link
                    to="/services"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. How It Works Preview ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Book Your Service in 3 Easy Steps</h2>
            <p className="text-slate-400 text-sm mt-2">Professional service delivery right at your door with complete peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl font-black mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Select Service & Slot</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Choose from over 50+ services and select your preferred date and convenient time slot.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl font-black mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Verified Pro Arrives</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                A background-checked professional arrives at your doorstep equipped with all necessary tools.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-2xl font-black mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Pay After Satisfaction</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Pay securely via UPI or Card only after job completion. Enjoy our 30-day service guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Customer Guarantee & Trust Section ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              🛡️ ServiceHub Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Your Satisfaction Is Guaranteed</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              If you are not completely satisfied with the quality of service provided, we will re-do the job completely free of charge within 30 days.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparent Pricing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Background</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Dedicated Support</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Link
              to="/services"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-base shadow-xl shadow-indigo-500/25 hover:scale-105 transition-transform text-center"
            >
              Book Service Now
            </Link>
            <Link
              to="/howitworks"
              className="px-8 py-3.5 rounded-2xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors text-center"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
