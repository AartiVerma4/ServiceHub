import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Clock, MapPin, CheckCircle2, ShieldAlert, Navigation, Download, MessageSquare, Star, Send, AlertTriangle, Camera, X } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingChat, setSelectedBookingChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sosLoading, setSosLoading] = useState(null);
  const [disputeModal, setDisputeModal] = useState(null); // bookingId
  const [disputeCategory, setDisputeCategory] = useState("service_quality");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [photoModal, setPhotoModal] = useState(null);

  const { socket, user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("booking_status_updated", ({ bookingId, status }) => {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
      });

      socket.on("receive_chat_message", (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      socket.on("chat_history", (messages) => {
        setChatMessages(messages);
      });
    }

    return () => {
      if (socket) {
        socket.off("booking_status_updated");
        socket.off("receive_chat_message");
        socket.off("chat_history");
      }
    };
  }, [socket]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const openChatModal = (booking) => {
    setSelectedBookingChat(booking);
    setChatMessages([]);
    if (socket) {
      socket.emit("join_chat_room", { bookingId: booking._id });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedBookingChat && socket) {
      socket.emit("send_chat_message", {
        bookingId: selectedBookingChat._id,
        senderId: user.id || user._id,
        senderRole: user.role,
        message: newMessage.trim(),
      });
      setNewMessage("");
    }
  };

  const downloadInvoice = async (bookingId) => {
    const token = localStorage.getItem("servicehub_token");
    window.open(`http://localhost:5000/api/payments/invoice/${bookingId}?token=${token}`, "_blank");
  };

  const handleSOS = async (bookingId) => {
    if (!window.confirm("🆘 Confirm: Send emergency SOS alert to our admin team?")) return;
    setSosLoading(bookingId);
    try {
      await api.post(`/bookings/${bookingId}/sos`, { message: "Emergency — customer triggered SOS." });
      alert("✅ SOS sent! Our admin team has been notified and will contact you immediately.");
    } catch (err) {
      alert("Failed to send SOS. Please call our support helpline immediately.");
    } finally {
      setSosLoading(null);
    }
  };

  const handleDisputeSubmit = async () => {
    if (!disputeDesc.trim()) return alert("Please describe the issue.");
    try {
      await api.post("/disputes", {
        bookingId: disputeModal,
        category: disputeCategory,
        description: disputeDesc
      });
      alert("✅ Dispute raised. Our team will review it within 24 hours.");
      setDisputeModal(null);
      setDisputeDesc("");
    } catch (err) {
      alert(err.response?.data?.message || "Error raising dispute.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">Matching Provider</span>;
      case "assigned":
        return <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">Provider Assigned</span>;
      case "in-progress":
        return <span className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-bold border border-sky-500/30 animate-pulse">Service In-Progress</span>;
      case "completed":
        return <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">Completed</span>;
      default:
        return <span className="bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-8">My Service Bookings & Live Tracking</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card h-40 rounded-3xl animate-pulse bg-slate-900/50" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-lg">You have no active or previous bookings.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b._id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-slate-400">ID: {b.bookingId}</span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {b.services?.[0]?.service?.name || "Home Service"}
                  </h3>
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{b.scheduledDate} ({b.timeSlot})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">{b.address?.street}, {b.address?.city}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <span>Total Paid: ₹{b.pricing?.totalAmount}</span>
                </div>
              </div>

              {/* Provider Info */}
              {b.provider && (
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
                      {b.provider?.userId?.name?.[0] || "P"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{b.provider?.userId?.name || "Assigned Provider"}</p>
                      <p className="text-[11px] text-slate-400">Verified Home Expert</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openChatModal(b)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Live Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => downloadInvoice(b._id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-indigo-400" /> Invoice PDF
                </button>

                {["pending", "assigned"].includes(b.status) && (
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to cancel this booking? Refund policy will be automatically applied.")) {
                        try {
                          const res = await api.patch(`/bookings/${b._id}/status`, { status: "cancelled", note: "Cancelled by customer" });
                          if (res.data.success) {
                            alert("Booking cancelled successfully!");
                            fetchBookings();
                          }
                        } catch (err) {
                          alert(err.response?.data?.message || "Cancellation failed.");
                        }
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 text-xs font-bold border border-rose-500/20"
                  >
                    Cancel Booking
                  </button>
                )}

                {b.status === "cancelled" && b.paymentStatus === "refunded" && (
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    ✓ Refunded ₹{b.refundAmount} via original payment method
                  </div>
                )}

                {/* SOS Safety Button — visible during active service */}
                {b.status === "in-progress" && (
                  <button
                    onClick={() => handleSOS(b._id)}
                    disabled={sosLoading === b._id}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 animate-pulse shadow-lg shadow-red-500/30"
                  >
                    🆘 {sosLoading === b._id ? "Sending..." : "SOS Emergency"}
                  </button>
                )}

                {/* Raise Dispute — on completed bookings */}
                {b.status === "completed" && (
                  <button
                    onClick={() => setDisputeModal(b._id)}
                    className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 text-amber-300 text-xs font-bold border border-amber-500/20 flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Raise Dispute
                  </button>
                )}

                {/* View Job Photos */}
                {b.jobPhotos?.length > 0 && (
                  <button
                    onClick={() => setPhotoModal(b)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-400" /> Photos ({b.jobPhotos.length})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl border border-amber-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Raise a Dispute</h3>
              <button onClick={() => setDisputeModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Issue Category</label>
              <select
                value={disputeCategory}
                onChange={e => setDisputeCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100"
              >
                <option value="service_quality">Service Quality Issue</option>
                <option value="no_show">Provider No-Show</option>
                <option value="overcharged">Overcharged / Wrong Pricing</option>
                <option value="safety_concern">Safety Concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Describe the Issue</label>
              <textarea
                rows={4}
                value={disputeDesc}
                onChange={e => setDisputeDesc(e.target.value)}
                placeholder="Please describe what happened in detail..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
            <button
              onClick={handleDisputeSubmit}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              Submit Dispute
            </button>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Camera className="w-5 h-5 text-indigo-400" /> Job Photos</h3>
              <button onClick={() => setPhotoModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photoModal.jobPhotos.map((p, i) => (
                <div key={i} className="space-y-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${p.type === "before" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {p.type === "before" ? "Before" : "After"}
                  </span>
                  <img src={p.url} alt={p.type} className="w-full rounded-xl border border-slate-700 object-cover max-h-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In-App Chat Modal */}
      {selectedBookingChat && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700 p-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Live Chat with Provider</h3>
                <p className="text-xs text-slate-400">Booking ID: {selectedBookingChat.bookingId}</p>
              </div>
              <button
                onClick={() => setSelectedBookingChat(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Messages Box */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatMessages.length === 0 ? (
                <p className="text-center text-xs text-slate-500 mt-10">No messages yet. Start chatting!</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.senderRole === user.role ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-xs max-w-[80%] ${
                        msg.senderRole === user.role
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5">{msg.sender?.name || msg.senderRole}</span>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
