import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function AvailabilityCalendar() {
  const { user } = useAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [blocks, setBlocks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("Day off");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBlocks(); }, [year, month]);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/providers/availability/blocks");
      if (res.data.success) setBlocks(res.data.blocks);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const isBlocked = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return blocks.find(b => b.date === dateStr);
  };

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelected(dateStr);
  };

  const handleBlock = async () => {
    if (!selected) return;
    try {
      await api.post("/providers/availability/block", { date: selected, reason });
      fetchBlocks();
      setSelected(null);
    } catch (err) { console.error(err); }
  };

  const handleUnblock = async (blockId) => {
    try {
      await api.delete(`/providers/availability/block/${blockId}`);
      fetchBlocks();
    } catch (err) { console.error(err); }
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthName = new Date(year, month).toLocaleString("en-IN", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-sky-400" /> Availability Calendar
      </h1>
      <p className="text-slate-400 text-sm mb-8">Block dates when you're unavailable. Bookings won't be assigned to you on blocked days.</p>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-lg font-bold text-white">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Day-of-Week Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const block = isBlocked(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = selected === dateStr;

            return (
              <button
                key={day}
                onClick={() => block ? handleUnblock(block._id) : handleDayClick(day)}
                title={block ? `Blocked: ${block.reason} (click to unblock)` : "Click to block this day"}
                className={`relative aspect-square rounded-xl text-sm font-semibold flex flex-col items-center justify-center transition-all ${
                  block ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
                  isSelected ? "bg-sky-500/30 text-sky-200 border border-sky-500/50 ring-2 ring-sky-500" :
                  isToday ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" :
                  "hover:bg-slate-800 text-slate-300 border border-transparent"
                }`}
              >
                {day}
                {block && <span className="text-[9px] font-normal mt-0.5 text-rose-400">Blocked</span>}
                {isToday && !block && <span className="text-[9px] font-normal mt-0.5 text-indigo-400">Today</span>}
              </button>
            );
          })}
        </div>

        {/* Block Form */}
        {selected && (
          <div className="mt-6 p-4 bg-slate-900/60 rounded-2xl border border-sky-500/20">
            <p className="text-sm font-bold text-white mb-3">
              Block <span className="text-sky-400">{new Date(selected + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long" })}</span>
            </p>
            <div className="flex gap-3">
              <input
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Reason (e.g. personal leave)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <button onClick={handleBlock} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Block Day
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500/40 inline-block" /> Blocked — click to unblock</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700 inline-block" /> Available — click to block</span>
        </div>
      </div>
    </div>
  );
}
