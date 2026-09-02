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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Wallet from './pages/Wallet';
import Referral from './pages/Referral';
import AvailabilityCalendar from './pages/AvailabilityCalendar';
import DisputePanel from './pages/DisputePanel';
import RecurringBookings from './pages/RecurringBookings';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AIAssistant from './components/AIAssistant';
import UserDashboard from './components/UserDashboard';

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Customer Protected Routes */}
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
              <Route path="/recurring" element={<ProtectedRoute><RecurringBookings /></ProtectedRoute>} />
              <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

              {/* Provider Routes */}
              <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
              <Route path="/provider-calendar" element={<ProtectedRoute><AvailabilityCalendar /></ProtectedRoute>} />

              {/* Admin Portal */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/disputes" element={<AdminRoute><DisputePanel /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
          <AIAssistant />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
