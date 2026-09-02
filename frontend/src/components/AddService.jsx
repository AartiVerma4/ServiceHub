import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CATEGORIES = [
  { value: "Salon", icon: "💇" },
  { value: "Cleaning", icon: "🧹" },
  { value: "AC Repair", icon: "❄️" },
  { value: "Plumbing", icon: "🔧" },
  { value: "Pest Control", icon: "🐜" },
  { value: "Electrician", icon: "💡" },
  { value: "Painting", icon: "🎨" },
  { value: "Carpentry", icon: "📦" },
];

export default function AddService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/services", {
        name: form.name,
        category: form.category,
        basePrice: Number(form.price),
        durationMinutes: 60,
        description: form.description,
        includedFeatures: ["Verified Technicians", "30-Day Guarantee"],
        isPopular: false,
      });
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.value === form.category);

  return (
    <div style={{ background: "#f5f3ff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #13102b 0%, #1a1433 100%)",
        padding: "40px 24px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,62,244,0.3), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button
            onClick={() => navigate("/admin")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#a0aec0", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 16px", marginBottom: 20, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          >
            ← Back to Admin
          </button>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "white", fontFamily: "Poppins, sans-serif", marginBottom: 8 }}>
            ➕ Add New Service
          </h1>
          <p style={{ color: "#a0aec0", fontSize: 15 }}>Fill in the details to list a new service on the platform</p>
        </div>
      </div>

      {/* Wave */}
      <div style={{ background: "linear-gradient(135deg, #13102b, #1a1433)", marginBottom: -2 }}>
        <svg viewBox="0 0 1440 50" style={{ display: "block" }}>
          <path fill="#f5f3ff" d="M0,50 C360,0 1080,50 1440,20 L1440,50 Z" />
        </svg>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: "40px", boxShadow: "0 8px 40px rgba(108,62,244,0.08)", border: "1px solid rgba(108,62,244,0.06)" }}>
          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 16px", marginBottom: 24, color: "#dc2626", fontSize: 14, fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Service Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Premium Home Cleaning"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Description *</label>
              <textarea
                name="description"
                placeholder="Describe what this service includes, what customers can expect, and any special features..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="input-field"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Starting Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 299"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category preview */}
            {selectedCategory && (
              <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(108,62,244,0.06)", border: "1px solid rgba(108,62,244,0.12)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{selectedCategory.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#6c3ef4", fontSize: 15 }}>Category: {selectedCategory.value}</div>
                  <div style={{ color: "#9ca3af", fontSize: 13 }}>This service will appear under the {selectedCategory.value} category</div>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Image URL <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
                className="input-field"
              />
              {form.image && (
                <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(108,62,244,0.15)", maxHeight: 180 }}>
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
            </div>

            {/* Summary card */}
            {form.name && form.price && (
              <div style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", borderRadius: 16, padding: "20px 22px", border: "1px solid rgba(108,62,244,0.12)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6c3ef4", marginBottom: 12 }}>📋 Service Preview</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 16 }}>{form.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{form.category || "No category"}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#6c3ef4" }}>₹{form.price}+</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ fontSize: 16, padding: "15px 40px", flex: 1, justifyContent: "center", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Adding Service..." : "✅ Add Service"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                style={{ padding: "15px 28px", borderRadius: 12, border: "2px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c3ef4"; e.currentTarget.style.color = "#6c3ef4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
