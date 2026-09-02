import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Wallet, ArrowUpRight, ArrowDownLeft, Coins } from "lucide-react";

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet/my");
      if (res.data.success) {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error("Wallet fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-3">
        <Wallet className="w-8 h-8 text-amber-400" /> Loyalty Wallet
      </h1>

      {/* Balance Card */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-8 border border-amber-500/20 mb-8 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <Coins className="w-12 h-12 text-amber-400 mb-4 relative z-10" />
        <p className="text-sm text-slate-400 font-semibold relative z-10">Available Balance</p>
        <h2 className="text-5xl font-black text-white mt-1 relative z-10">
          ₹{balance}
          <span className="text-base font-normal text-amber-400 ml-3">ServiceHub Coins</span>
        </h2>
        <p className="text-xs text-slate-500 mt-3 relative z-10">1 Coin = ₹1 | Earn 1 coin per ₹10 spent</p>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "🎁", title: "Welcome Bonus", desc: "₹100 free on signup" },
          { icon: "💰", title: "Earn on Bookings", desc: "1 coin per ₹10 spent" },
          { icon: "⭐", title: "Review Bonus", desc: "+25 coins for reviews" },
        ].map((item) => (
          <div key={item.title} className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm font-bold text-white">{item.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(n => <div key={n} className="h-12 bg-slate-900/50 rounded-xl animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No transactions yet. Start booking to earn coins!</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                    {tx.type === "credit"
                      ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      : <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{tx.description}</p>
                    <p className="text-[11px] text-slate-500">{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <span className={`font-black text-sm ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
