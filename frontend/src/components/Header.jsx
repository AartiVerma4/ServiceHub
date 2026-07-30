import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Wrench, ShoppingBag, LogOut, ShieldAlert, Sun, Moon } from "lucide-react";

export default function Header() {
  const { user, logout, cart, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wrench className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              Service<span className="text-gradient">Hub</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">Home Services</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/services" className="hover:text-indigo-400 transition-colors">Explore Services</Link>
          <Link to="/howitworks" className="hover:text-indigo-400 transition-colors">How It Works</Link>
          <Link to="/reviews" className="hover:text-indigo-400 transition-colors">Customer Reviews</Link>
          {user?.role === "provider" && (
            <Link to="/provider-dashboard" className="text-emerald-400 font-semibold hover:text-emerald-300">Provider Dashboard</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all flex items-center justify-center border border-slate-700/60"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Auth Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 border border-slate-700">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{user.email}</p>
                    <p className="text-[11px] font-bold text-indigo-400 uppercase mt-0.5">{user.role}</p>
                  </div>
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" /> My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
