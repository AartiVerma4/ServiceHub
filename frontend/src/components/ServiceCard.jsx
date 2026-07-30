import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  "Salon": { bg: "#f0e6ff", accent: "#7c3aed", icon: "💇" },
  "Cleaning": { bg: "#e6f3ff", accent: "#2563eb", icon: "🧹" },
  "AC Repair": { bg: "#e6fff5", accent: "#059669", icon: "❄️" },
  "Plumbing": { bg: "#fff7e6", accent: "#d97706", icon: "🔧" },
  "Pest Control": { bg: "#ffe6e6", accent: "#dc2626", icon: "🐜" },
  "Electrician": { bg: "#fef9e6", accent: "#ca8a04", icon: "💡" },
  "Painting": { bg: "#fce6ff", accent: "#9333ea", icon: "🎨" },
  "Carpentry": { bg: "#e6ffe6", accent: "#16a34a", icon: "📦" },
};

const getCategoryStyle = (category) =>
  categoryColors[category] || { bg: "#f5f3ff", accent: "#6c3ef4", icon: "🏠" };

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const catStyle = getCategoryStyle(service.category);

  const handleBook = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    navigate(`/bookings?serviceId=${service._id}`);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 24,
        overflow: "hidden",
        border: hovered ? `2px solid ${catStyle.accent}30` : "2px solid rgba(108,62,244,0.06)",
        boxShadow: hovered ? `0 20px 50px ${catStyle.accent}20` : "0 4px 20px rgba(108,62,244,0.06)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / Icon Header */}
      <div style={{
        height: 180,
        background: service.image
          ? `url(${service.image}) center/cover no-repeat`
          : `linear-gradient(135deg, ${catStyle.bg}, ${catStyle.accent}20)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {!service.image && (
          <span style={{ fontSize: 64, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
            {catStyle.icon}
          </span>
        )}

        {/* Overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${catStyle.accent}dd, ${catStyle.accent}99)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <button
            onClick={handleBook}
            style={{
              padding: "12px 32px",
              borderRadius: 50,
              background: "white",
              color: catStyle.accent,
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              transform: hovered ? "scale(1)" : "scale(0.8)",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            Book Now →
          </button>
        </div>

        {/* Price badge */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "white",
          borderRadius: 50,
          padding: "5px 14px",
          fontSize: 13, fontWeight: 700,
          color: catStyle.accent,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}>
          ₹{service.price}+
        </div>

        {/* Category badge */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: catStyle.accent,
          borderRadius: 50,
          padding: "4px 12px",
          fontSize: 12, fontWeight: 600,
          color: "white",
        }}>
          {service.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>
          {service.name}
        </h3>
        <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, marginBottom: 16, minHeight: 38 }}>
          {service.description || "Professional service delivered at your doorstep."}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
            ))}
            <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>4.8 (1.2k)</span>
          </div>

          <button
            onClick={handleBook}
            style={{
              padding: "8px 18px",
              borderRadius: 50,
              background: hovered ? `linear-gradient(135deg, ${catStyle.accent}, ${catStyle.accent}cc)` : "rgba(108,62,244,0.06)",
              color: hovered ? "white" : catStyle.accent,
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Book →
          </button>
        </div>
      </div>
    </div>
  );
}
