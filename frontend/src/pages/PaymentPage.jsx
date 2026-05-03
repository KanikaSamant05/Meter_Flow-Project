import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, Layers } from "lucide-react";

const FIELD = "bg-[#0d0d14] border border-[#2a2a3a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/50 font-mono transition-colors w-full";
const LABEL = "text-[10px] text-white/30 font-mono uppercase tracking-widest mb-1 block";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cost = 0.0019, totalCost = 0.0019, pokemonName = "" } = location.state || {};

  const [form, setForm] = useState({
    cardNumber: "", expiry: "", cvv: "",
    firstName: "", lastName: "", country: "United States",
  });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  function set(k) { return e => setForm(p => ({ ...p, [k]: e.target.value })); }

  function formatCard(v) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  }

  function handlePay() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 2000);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-green-400" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Payment successful</h2>
          <p className="text-white/40 text-sm font-mono mb-6">${cost.toFixed(4)} charged · request processing</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-violet-500/20 border border-violet-500/40 text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-500/30 transition-all"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Nav */}
      <div className="bg-[#0d0d14] border-b border-[#1e1e2e] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Layers size={14} className="text-white" />
          </div>
          <span className="text-white text-sm font-medium tracking-tight">APIForge</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Secure checkout
          <Lock size={11} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* Left — form */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs font-mono mb-8 transition-colors"
          >
            <ArrowLeft size={13} /> back
          </button>

          <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-5">Payment details</p>

          {/* Card info */}
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 mb-4">
            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-4">Card information</p>
            <div className="mb-3">
              <label className={LABEL}>Card number</label>
              <input
                className={FIELD}
                value={form.cardNumber}
                onChange={e => setForm(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Expiry</label>
                <input
                  className={FIELD}
                  value={form.expiry}
                  onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  placeholder="MM / YY"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className={LABEL}>CVV</label>
                <input
                  className={FIELD}
                  value={form.cvv}
                  onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  placeholder="•••"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          {/* Billing address */}
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 mb-4">
            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-4">Billing address</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={LABEL}>First name</label>
                <input className={FIELD} value={form.firstName} onChange={set("firstName")} placeholder="John" />
              </div>
              <div>
                <label className={LABEL}>Last name</label>
                <input className={FIELD} value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Country</label>
              <select
                className={FIELD + " cursor-pointer"}
                value={form.country}
                onChange={set("country")}
              >
                {["United States", "United Kingdom", "Canada", "Germany", "France", "India", "Australia", "Other"].map(c => (
                  <option key={c} value={c} className="bg-[#111118]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-green-500/[0.06] border border-green-500/20 rounded-lg mb-6">
            <ShieldCheck size={14} className="text-green-400 shrink-0" />
            <p className="text-green-400/80 text-xs font-mono">256-bit SSL encryption · PCI DSS Level 1 compliant</p>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={processing}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              processing
                ? "bg-violet-500/10 border border-violet-500/20 text-violet-400/40 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            <Lock size={13} />
            {processing ? "Processing···" : `Pay $${cost.toFixed(4)}`}
          </button>
        </div>

        {/* Right — order summary */}
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-4">Order summary</p>

            <div className="flex items-center gap-3 pb-4 border-b border-[#1e1e2e] mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#0d0d14] border border-[#2a2a3a] flex items-center justify-center shrink-0">
                <Layers size={15} className="text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-white capitalize">{pokemonName || "API"} lookup</p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">1 request · overage billing</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-white/30">Subtotal</span>
                <span className="text-white/50">${cost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Tax</span>
                <span className="text-white/50">$0.0000</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#1e1e2e]">
                <span className="text-white font-medium text-sm" style={{ fontFamily: "inherit" }}>Total</span>
                <span className="text-white font-medium text-sm">${cost.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase mb-3">Billing account</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-900/40 border border-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-400 text-[11px] font-medium">
                  {form.firstName?.[0] || "U"}{form.lastName?.[0] || ""}
                </span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">
                  {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : "Your account"}
                </p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">Metered billing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            {["Visa", "MC", "Amex", "PayPal"].map(b => (
              <span key={b} className="text-[10px] text-white/15 font-mono border border-white/[0.06] rounded px-2 py-1">{b}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}