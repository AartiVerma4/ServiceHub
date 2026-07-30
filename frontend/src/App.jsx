import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ServiceList from './components/ServiceList';
import CartBooking from './components/CartBooking';
import Bookings from './pages/Bookings';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './components/AdminDashboard';
import HowItWorksPage from './pages/HowItWorksPage';
import Reviews from './components/Reviews';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/cart" element={<CartBooking />} />
              <Route path="/howitworks" element={<HowItWorksPage />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Customer Protected Route */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />

              {/* Provider Workspace */}
              <Route
                path="/provider-dashboard"
                element={
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
