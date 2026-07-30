import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import {
  Star, Clock, Zap, Plus, Check, Search, ShieldCheck,
  SlidersHorizontal, TrendingUp, ChevronDown, X, ShoppingBag
} from "lucide-react";

// High quality unsplash images mapped per category & service
const SERVICE_IMAGES = {
  "Full Home Deep Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "Luxury Salon Facial & Glow": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  "Salon at Home – Full Package": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "AC Power Jet Wash Service": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  "AC Gas Refill & Repair": "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80",
  "Plumbing Leak Repair": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
  "Full Bathroom Plumbing Fix": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  "Fan & Switchboard Installation": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  "Full Home Electrical Checkup": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
  "Cockroach & Ant Pest Control": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
};

const CATEGORY_DEFAULT_IMAGE = {
  "Salon & Spa": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "AC & Appliance Repair": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  "Plumbing": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
  "Electrician": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
  "Pest Control": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
};

// ─── Hardcoded fallback services (renders even if backend offline) ──
const FALLBACK_SERVICES = [
  { _id: "f1", name: "Full Home Deep Cleaning", category: "Cleaning", subCategory: "Deep Cleaning", basePrice: 1499, currentPrice: 1499, durationMinutes: 180, description: "Complete 360° deep cleaning & sanitization for 2BHK/3BHK apartments using industrial equipment.", includedFeatures: ["Kitchen degreasing", "Bathroom stain removal", "Floor scrubbing", "Balcony wash"], isPopular: true, isSurgeActive: false, rating: { average: 4.9, count: 312 } },
  { _id: "f2", name: "Luxury Salon Facial & Glow", category: "Salon & Spa", subCategory: "Facials", basePrice: 799, currentPrice: 799, durationMinutes: 60, description: "Organic skin-brightening, deep pore cleansing and diamond radiance glow facial at your home.", includedFeatures: ["Single-use hygienic kit", "O3+ certified products", "Face & neck massage"], isPopular: true, isSurgeActive: false, rating: { average: 4.8, count: 245 } },
  { _id: "f3", name: "Salon at Home – Full Package", category: "Salon & Spa", subCategory: "Full Package", basePrice: 1299, currentPrice: 1299, durationMinutes: 120, description: "Hair cut, blow-dry, waxing and facial combo package by certified beauty experts.", includedFeatures: ["Premium products only", "Sanitized tools", "Certified beautician"], isPopular: true, isSurgeActive: false, rating: { average: 4.7, count: 189 } },
  { _id: "f4", name: "AC Power Jet Wash Service", category: "AC & Appliance Repair", subCategory: "AC Service", basePrice: 499, currentPrice: 499, durationMinutes: 45, description: "High-pressure jet cleaning with anti-bacterial foam for 2× faster cooling efficiency.", includedFeatures: ["Filter cleaning", "Drain pipe flush", "Gas level check", "30-day warranty"], isPopular: true, isSurgeActive: false, rating: { average: 4.9, count: 428 } },
  { _id: "f5", name: "AC Gas Refill & Repair", category: "AC & Appliance Repair", subCategory: "AC Repair", basePrice: 1199, currentPrice: 1199, durationMinutes: 90, description: "Complete gas top-up, thermostat check and cooling efficiency diagnostic.", includedFeatures: ["R-32 / R-410A compatible", "Leak detection", "Gas pressure test"], isPopular: false, isSurgeActive: false, rating: { average: 4.8, count: 167 } },
  { _id: "f6", name: "Plumbing Leak Repair", category: "Plumbing", subCategory: "Repair", basePrice: 299, currentPrice: 299, durationMinutes: 40, description: "Instant fix for dripping taps, concealed leaks, pipe fittings and blockages.", includedFeatures: ["Licensed plumber", "Free spare-part quote", "No-mess guarantee"], isPopular: false, isSurgeActive: false, rating: { average: 4.7, count: 203 } },
  { _id: "f7", name: "Full Bathroom Plumbing Fix", category: "Plumbing", subCategory: "Bathroom", basePrice: 799, currentPrice: 799, durationMinutes: 90, description: "Shower head replacement, flush tank repair, tap change and complete overhaul.", includedFeatures: ["ISI-marked fittings", "Water pressure test", "Post-service clean-up"], isPopular: false, isSurgeActive: false, rating: { average: 4.6, count: 98 } },
  { _id: "f8", name: "Fan & Switchboard Installation", category: "Electrician", subCategory: "Installation", basePrice: 199, currentPrice: 199, durationMinutes: 30, description: "Safe installation of ceiling fans, modular switchboards and LED panel lights.", includedFeatures: ["Certified electrician", "Insulated safety gear", "ISI-certified work"], isPopular: false, isSurgeActive: false, rating: { average: 4.8, count: 341 } },
  { _id: "f9", name: "Full Home Electrical Checkup", category: "Electrician", subCategory: "Checkup", basePrice: 599, currentPrice: 599, durationMinutes: 60, description: "Wiring audit, earthing test, overload protection check and short-circuit prevention.", includedFeatures: ["Thermal imaging test", "Safety report", "Certified electrician"], isPopular: false, isSurgeActive: false, rating: { average: 4.9, count: 112 } },
  { _id: "f10", name: "Cockroach & Ant Pest Control", category: "Pest Control", subCategory: "General", basePrice: 899, currentPrice: 899, durationMinutes: 50, description: "Advanced gel-baiting technology safe for pets and children. Odourless treatment.", includedFeatures: ["Herb-based spray", "90-day warranty", "Child & pet safe"], isPopular: true, isSurgeActive: false, rating: { average: 4.8, count: 276 } },
];

const ALL_CATEGORIES = ["All", "Salon & Spa", "Cleaning", "AC & Appliance Repair", "Plumbing", "Electrician", "Pest Control"];

const SORT_OPTIONS = [
  { label: "Popularity",    value: "popular"    },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated",    value: "rating"     },
  { label: "Duration",     value: "duration"   },
];

const CATEGORY_EMOJI = {
  "Salon & Spa": "✨",
  "Cleaning": "🧹",
  "AC & Appliance Repair": "❄️",
  "Plumbing": "🔧",
  "Electrician": "⚡",
  "Pest Control": "🛡️",
};

export default function ServiceList() {
  const [searchParams] = useSearchParams();
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [surgeActive, setSurgeActive] = useState(false);

  const [searchQuery, setSearchQuery]         = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy]                   = useState("popular");
  const [maxPrice, setMaxPrice]               = useState(2000);
  const [showFilters, setShowFilters]         = useState(false);

  const { addToCart, cart } = useAuth();

  // ── Fetch from API, fallback to local data ──────────────────
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get("/services");
        if (res.data.success && res.data.services.length > 0) {
          setAllServices(res.data.services);
          setSurgeActive(res.data.surgeMultiplier > 1.0);
        } else {
          setAllServices(FALLBACK_SERVICES);
        }
      } catch {
        setAllServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // ── Filtered + sorted derived list ──────────────────────────
  const displayed = useCallback(() => {
    let list = [...allServices];

    // category filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter(s =>
        s.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    }

    // price filter
    list = list.filter(s => (s.currentPrice || s.basePrice) <= maxPrice);

    // sort
    if (sortBy === "price_asc")  list.sort((a, b) => (a.currentPrice || a.basePrice) - (b.currentPrice || b.basePrice));
    if (sortBy === "price_desc") list.sort((a, b) => (b.currentPrice || b.basePrice) - (a.currentPrice || a.basePrice));
    if (sortBy === "rating")     list.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    if (sortBy === "duration")   list.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
    if (sortBy === "popular")    list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return list;
  }, [allServices, selectedCategory, searchQuery, maxPrice, sortBy]);

  const services = displayed();
  const isInCart = id => cart.some(item => item.service._id === id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-10 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Professionals
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
            Explore Home Services
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Browse {allServices.length}+ premium services. All providers are background-verified with a 30-day warranty.
          </p>

          {/* Search Bar */}
          <div className="flex items-center gap-2 max-w-xl mx-auto glass-panel rounded-2xl p-2 border border-slate-700">
            <Search className="w-5 h-5 text-slate-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search AC repair, salon facial, cleaning…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm py-1.5"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1 text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Pills ──────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              {cat !== "All" && <span>{CATEGORY_EMOJI[cat] || "🔹"}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ── Toolbar: Results count + Sort + Filter toggle ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400">
              Showing <span className="font-bold text-white">{services.length}</span> services
              {selectedCategory !== "All" && <span className="text-indigo-400"> in {selectedCategory}</span>}
            </p>
            {surgeActive && (
              <span className="badge-surge text-white px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-white" /> Surge Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${showFilters ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
          </div>
        </div>

        {/* ── Filter Panel ────────────────────────────────── */}
        {showFilters && (
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Max Price: <span className="text-white font-bold">₹{maxPrice}</span>
              </label>
              <input
                type="range"
                min={100}
                max={3000}
                step={100}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹100</span><span>₹3,000</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Quick Filter</label>
              <div className="flex flex-wrap gap-2">
                {["Under ₹500", "₹500–₹1000", "Above ₹1000"].map(label => {
                  const ranges = { "Under ₹500": 499, "₹500–₹1000": 1000, "Above ₹1000": 3000 };
                  return (
                    <button
                      key={label}
                      onClick={() => setMaxPrice(ranges[label])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${maxPrice === ranges[label] ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Services Grid ───────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-80 rounded-3xl animate-pulse bg-slate-900/60" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 mt-8">
            <p className="text-3xl mb-3">🔍</p>
            <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setMaxPrice(2000); }}
              className="mt-5 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => {
              const price = service.currentPrice || service.basePrice;
              const inCart = isInCart(service._id);
              const imageUrl = service.images?.[0] || SERVICE_IMAGES[service.name] || CATEGORY_DEFAULT_IMAGE[service.category] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={service._id}
                  className="glass-card rounded-3xl border border-slate-800 flex flex-col overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Service Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    
                    {/* Top Badges over Image */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-md">
                        {CATEGORY_EMOJI[service.category] || "🔹"} {service.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {service.isPopular && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-500/30 shadow-md">
                          <TrendingUp className="w-3 h-3 text-amber-400" /> Popular
                        </span>
                      )}
                      {service.isSurgeActive && (
                        <span className="text-[10px] font-bold text-orange-300 bg-orange-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-orange-500/30 shadow-md">
                          ⚡ Surge
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Title + Rating */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white leading-snug">{service.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/20 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-300" /> {service.rating?.average || 4.9}
                        <span className="text-slate-500 font-normal">({service.rating?.count || 0})</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{service.description}</p>

                    {/* Features */}
                    <div className="space-y-1.5 mb-5">
                      {(service.includedFeatures || []).slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          {feat}
                        </div>
                      ))}
                    </div>

                    <div className="flex-1" />

                    {/* Footer: Price + Duration + CTA */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-white">₹{price.toLocaleString("en-IN")}</span>
                          {service.isSurgeActive && (
                            <span className="text-xs text-slate-500 line-through">₹{service.basePrice.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {service.durationMinutes >= 60
                            ? `${Math.floor(service.durationMinutes / 60)}h${service.durationMinutes % 60 ? ` ${service.durationMinutes % 60}m` : ""}`
                            : `${service.durationMinutes} mins`}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(service)}
                        disabled={inCart}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          inCart
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95"
                        }`}
                      >
                        {inCart
                          ? <><Check className="w-4 h-4" /> Added</>
                          : <><Plus className="w-4 h-4" /> Book</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Cart CTA bar (floating) ──────────────────────── */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Link
              to="/cart"
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-2xl shadow-indigo-500/30 hover:opacity-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              View Cart · {cart.length} item{cart.length > 1 ? "s" : ""}
              <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                ₹{cart.reduce((s, i) => s + (i.service.currentPrice || i.service.basePrice) * i.quantity, 0).toLocaleString("en-IN")}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
