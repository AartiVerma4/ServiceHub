import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your ServiceHub AI Assistant. How can I help you today? Ask me things like:\n• 'My AC is not cooling'\n• 'Need kitchen deep cleaning'" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      // Build conversation history format for API
      const history = messages.slice(1); // skip initial greeting
      const res = await api.post("/ai/chat", { message: userMsg, history });
      if (res.data.success) {
        setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group animate-bounce"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          {/* Tooltip */}
          <div className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl">
            ⚡ ServiceHub AI Assistant
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] glass-panel rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-xl transition-all duration-300 scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  AI Assistant <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-900 text-slate-300 border border-slate-800/80 rounded-bl-none whitespace-pre-line"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Assistant is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-900 bg-slate-900/10">
              {[
                "AC Cooling issue",
                "Deep Home Cleaning",
                "Plumber repair",
              ].map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-indigo-300 transition-colors"
                >
                  ✨ {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-900 bg-slate-900/30 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
