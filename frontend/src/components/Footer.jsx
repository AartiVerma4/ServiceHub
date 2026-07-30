import React from "react";
import { Link } from "react-router-dom";
import { Wrench, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-white">
            <Wrench className="w-5 h-5 text-indigo-400" /> Service<span className="text-gradient">Hub</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's most trusted home services marketplace. Background-verified professionals for cleaning, repair, and salon care.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Top Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/services?category=Cleaning" className="hover:text-indigo-400">Home Cleaning</Link></li>
            <li><Link to="/services?category=AC Repair" className="hover:text-indigo-400">AC & Appliance Repair</Link></li>
            <li><Link to="/services?category=Salon" className="hover:text-indigo-400">Salon & Spa at Home</Link></li>
            <li><Link to="/services?category=Plumbing" className="hover:text-indigo-400">Plumbing Solutions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">For Providers</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/signup" className="hover:text-indigo-400">Register as Professional</Link></li>
            <li><Link to="/provider-dashboard" className="hover:text-indigo-400">Provider Partner Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Security & Trust</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Professionals
          </p>
          <p className="text-xs text-slate-400">Razorpay Encrypted Payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 ServiceHub Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for portfolio excellence</p>
      </div>
    </footer>
  );
}
