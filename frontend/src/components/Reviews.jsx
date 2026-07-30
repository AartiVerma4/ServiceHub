import React, { useState } from "react";
import { Star, Quote, ThumbsUp, Clock, CheckCircle2, PenLine, X } from "lucide-react";

const STATIC_REVIEWS = [
  { name: "Priya Sharma",  city: "Mumbai",    service: "Salon at Home",    comment: "Absolutely loved the experience! The beautician was professional, punctual and did an amazing job. ServiceHub is my go-to for all beauty needs.", rating: 5, avatar: "P", color: "from-pink-600 to-rose-500",    date: "15 Jul 2026" },
  { name: "Rahul Gupta",   city: "Delhi",     service: "Deep Cleaning",    comment: "Best deep cleaning service I've ever used! My apartment looks brand new. The team was thorough, efficient and very courteous.", rating: 5, avatar: "R", color: "from-indigo-600 to-blue-500",   date: "20 Jul 2026" },
  { name: "Anjali Mehta",  city: "Bangalore", service: "AC Repair",        comment: "My AC wasn't cooling for a week. The technician diagnosed and fixed it in minutes. 5 stars without hesitation — fast, clean, professional!", rating: 5, avatar: "A", color: "from-emerald-600 to-teal-500",  date: "18 Jul 2026" },
  { name: "Vikram Patel",  city: "Pune",      service: "Electrician",      comment: "Very professional work. Fixed all faulty wiring, explained every step, and cleaned up after. Excellent service at a fair price.", rating: 4, avatar: "V", color: "from-amber-600 to-yellow-500", date: "22 Jul 2026" },
  { name: "Sneha Reddy",   city: "Hyderabad", service: "Pest Control",     comment: "Eco-friendly pest control that actually works! No smell, no mess, completely pest-free in 24 hours. Highly recommended for families!", rating: 5, avatar: "S", color: "from-red-600 to-pink-500",     date: "25 Jul 2026" },
  { name: "Arjun Singh",   city: "Chennai",   service: "Plumbing",         comment: "Fixed a severe pipe leakage that 3 other plumbers couldn't solve. Quick, clean and reasonably priced. Will definitely call again!", rating: 5, avatar: "A", color: "from-violet-600 to-purple-500", date: "12 Jul 2026" },
  { name: "Meera Iyer",    city: "Kochi",     service: "Salon at Home",    comment: "Loved the at-home salon experience. The beautician was so skilled and brought everything needed. Felt like a 5-star salon visit!", rating: 5, avatar: "M", color: "from-fuchsia-600 to-pink-500",  date: "28 Jul 2026" },
  { name: "Deepak Joshi",  city: "Jaipur",    service: "AC Service",       comment: "Super quick AC service. Booked at 9 AM, technician arrived by 11, done by noon. AC cools perfectly now. Great experience!", rating: 5, avatar: "D", color: "from-cyan-600 to-sky-500",      date: "30 Jul 2026" },
];

const STATS = [
  { value: "4.8/5",  label: "Avg Rating",      icon: <Star className="w-6 h-6 fill-amber-400 text-amber-400" /> },
  { value: "12M+",   label: "Reviews Posted",  icon: <PenLine className="w-6 h-6 text-indigo-400" /> },
  { value: "98%",    label: "Recommended",     icon: <ThumbsUp className="w-6 h-6 text-emerald-400" /> },
  { value: "99%",    label: "On-Time Rate",    icon: <Clock className="w-6 h-6 text-purple-400" /> },
];

const SERVICES_LIST = [
  "Salon at Home", "Deep Cleaning", "AC Service & Repair",
  "Plumbing Fix", "Electrician", "Pest Control", "Full Home Electrical Checkup", "Other",
];

export default function Reviews() {
  const [userReviews, setUserReviews] = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  const [form, setForm] = useState({
    name: "", city: "", service: SERVICES_LIST[0], comment: "", rating: 5,
  });
  const [hoverStar, setHoverStar] = useState(0);
  const [errors, setErrors]       = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Please enter your name";
    if (!form.city.trim())    e.city    = "Please enter your city";
    if (!form.comment.trim()) e.comment = "Please write a review";
    if (form.comment.trim().length < 20) e.comment = "Review must be at least 20 characters";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const now = new Date();
    const newReview = {
      ...form,
      avatar: form.name[0].toUpperCase(),
      color: "from-indigo-600 to-purple-500",
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      isNew: true,
    };
    setUserReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setForm({ name: "", city: "", service: SERVICES_LIST[0], comment: "", rating: 5 });
    setErrors({});
  };

  const allReviews = [...userReviews, ...STATIC_REVIEWS];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-12 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Star className="w-3.5 h-3.5 fill-amber-300" /> Customer Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">What Our Customers Say</h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Real verified reviews from real people who booked through ServiceHub.
          </p>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {STATS.map(s => (
          <div key={s.label} className="glass-panel rounded-2xl p-5 text-center border border-slate-800">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Write-a-review CTA row ────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-white">
            Customer Reviews
            <span className="ml-2 text-sm font-normal text-slate-400">({allReviews.length} reviews)</span>
          </h2>
          <button
            onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><PenLine className="w-4 h-4" /> Write a Review</>}
          </button>
        </div>

        {/* ── Success Banner ───────────────────────────── */}
        {submitted && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-bold text-sm">Thank you for your review!</p>
              <p className="text-emerald-400/70 text-xs">Your feedback helps us serve everyone better.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="ml-auto text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Review Form ──────────────────────────────── */}
        {showForm && (
          <div className="glass-panel rounded-3xl border border-indigo-500/30 p-6 sm:p-8 mb-10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PenLine className="w-5 h-5 text-indigo-400" /> Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 ${errors.name ? "border-rose-500" : "border-slate-700"}`}
                  />
                  {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={e => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: "" }); }}
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 ${errors.city ? "border-rose-500" : "border-slate-700"}`}
                  />
                  {errors.city && <p className="text-rose-400 text-[11px] mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Service Used */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Service Used *</label>
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Your Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      className="text-3xl transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    >
                      <span className={(hoverStar || form.rating) >= star ? "text-amber-400" : "text-slate-700"}>★</span>
                    </button>
                  ))}
                  <span className="text-sm font-semibold text-slate-300 ml-2">
                    {["", "Poor", "Fair", "Good", "Great", "Excellent!"][form.rating]}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Your Review * <span className="text-slate-600">(min 20 characters)</span></label>
                <textarea
                  placeholder="Tell others about the quality of service, professionalism of the provider, and overall experience…"
                  value={form.comment}
                  onChange={e => { setForm({ ...form, comment: e.target.value }); setErrors({ ...errors, comment: "" }); }}
                  rows={4}
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 resize-none ${errors.comment ? "border-rose-500" : "border-slate-700"}`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.comment
                    ? <p className="text-rose-400 text-[11px]">{errors.comment}</p>
                    : <span />
                  }
                  <span className={`text-[11px] ${form.comment.length < 20 ? "text-slate-500" : "text-emerald-400"}`}>
                    {form.comment.length} chars
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg hover:opacity-95 transition-all active:scale-95"
                >
                  Submit Review ⭐
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setErrors({}); }}
                  className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Reviews Grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReviews.map((r, idx) => (
            <div
              key={idx}
              className={`glass-card rounded-3xl p-6 border flex flex-col ${r.isNew ? "border-indigo-500/40" : "border-slate-800"}`}
            >
              {r.isNew && (
                <span className="self-start mb-3 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                  ✨ Just Posted
                </span>
              )}

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={`text-lg ${i <= r.rating ? "text-amber-400" : "text-slate-700"}`}>★</span>
                ))}
              </div>

              {/* Service badge */}
              <span className="self-start mb-3 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {r.service}
              </span>

              {/* Quote */}
              <div className="relative mb-5 flex-1">
                <Quote className="w-5 h-5 text-slate-700 absolute -top-1 -left-1" />
                <p className="text-slate-300 text-sm leading-relaxed pl-5 italic">"{r.comment}"</p>
              </div>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{r.name}</p>
                  <p className="text-slate-400 text-[11px]">{r.city} · {r.date}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" title="Verified Review" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
