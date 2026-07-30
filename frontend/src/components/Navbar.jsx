import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-200 via-teal-200 to-blue-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-green-700 tracking-tight font-montserrat">
              Urban <span className="text-blue-700 ml-1">Services</span>
            </Link>
          </div>
          <div className="hidden lg:flex space-x-6">
            <NavLink exact to="/" className="text-gray-700 hover:text-green-700 font-semibold transition">
              Home
            </NavLink>
            <NavLink to="/bookings" className="text-gray-700 hover:text-green-700 font-semibold transition">
              My Bookings
            </NavLink>
            <NavLink to="/login" className="text-gray-700 hover:text-blue-700 font-semibold transition">
              Login
            </NavLink>
            <NavLink to="/register" className="text-gray-700 hover:text-blue-700 font-semibold transition">
              Register
            </NavLink>
          </div>
          <div className="flex lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2"
              aria-controls="mobile-menu"
              aria-expanded={open}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  className={open ? "hidden" : "block"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={open ? "block" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`lg:hidden ${open ? 'block' : 'hidden'} bg-white shadow-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink exact to="/" className="block px-4 py-2 rounded text-gray-700 hover:bg-teal-50 hover:text-green-700 transition font-semibold">
            Home
          </NavLink>
          <NavLink to="/bookings" className="block px-4 py-2 rounded text-gray-700 hover:bg-teal-50 hover:text-green-700 transition font-semibold">
            My Bookings
          </NavLink>
          <NavLink to="/login" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-semibold">
            Login
          </NavLink>
          <NavLink to="/register" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-semibold">
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
