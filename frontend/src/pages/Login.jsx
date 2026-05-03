import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { btn, input, label } from '../lib/styles';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#0d0d16] border-r border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white text-lg">MeterFlow</span>
        </div>

        <div>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 font-mono text-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-500 text-xs ml-2">meter.sh</span>
            </div>
            <div className="text-slate-400 space-y-1 text-xs">
              <p><span className="text-blue-400">$</span> curl -X POST https://api.meterflow.io/meter \</p>
              <p className="pl-4">-H <span className="text-emerald-400">"X-API-Key: mf_live_a8f3...e21"</span></p>
              <p className="text-slate-600 mt-3">{'{'}</p>
              <p className="pl-4"><span className="text-blue-300">"ok"</span>: <span className="text-emerald-400">true</span>,</p>
              <p className="pl-4"><span className="text-blue-300">"project"</span>: <span className="text-emerald-400">"Image AI"</span>,</p>
              <p className="pl-4"><span className="text-blue-300">"cost"</span>: <span className="text-yellow-400">0.0019</span></p>
              <p className="text-slate-600">{'}'}</p>
              <p className="text-slate-500 mt-3"># Rate limited automatically.</p>
              <p className="text-slate-500"># Logged. Billed. Done.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[['99.99%', 'Uptime'], ['<8ms', 'Meter latency'], ['1M+', 'Keys issued']].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-xl font-semibold text-white">{val}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2024 MeterFlow. Bill APIs by the request, not the seat.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white text-lg">MeterFlow</span>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to your MeterFlow account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={label}>Email</label>
              <input type="email" className={input} placeholder="you@company.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className={label}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={`${input} pr-10`} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={`${btn.primary} w-full justify-center py-2.5 mt-2`}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}