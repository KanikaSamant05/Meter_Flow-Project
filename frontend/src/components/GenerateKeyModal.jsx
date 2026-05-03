import { useState } from 'react';
import { X, Copy, Check, AlertTriangle } from 'lucide-react';
import { useGenerateKey } from '../hooks/useApi';
import { btn, input, label } from '../lib/styles';
import toast from 'react-hot-toast';

export default function GenerateKeyModal({ open, onClose, apiId, apiName }) {
  const [form, setForm] = useState({ name: '', environment: 'live' });
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const generateKey = useGenerateKey();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await generateKey.mutateAsync({ apiId, ...form });
    setGeneratedKey(data.apiKey.key);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    toast.success('Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedKey(null);
    setForm({ name: '', environment: 'live' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-[#111118] border border-[#2a2a3a] rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
          <div>
            <h2 className="text-sm font-semibold text-white">Generate API Key</h2>
            <p className="text-xs text-slate-500 mt-0.5">{apiName}</p>
          </div>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
        </div>

        <div className="px-6 py-5">
          {!generatedKey ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={label}>Key Name *</label>
                <input className={input} placeholder="Production key, CI/CD, etc."
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>

              <div>
                <label className={label}>Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  {['live', 'test'].map(env => (
                    <button key={env} type="button"
                      onClick={() => setForm(f => ({ ...f, environment: env }))}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        form.environment === env
                          ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                          : 'bg-[#0e0e1a] border-[#2a2a3a] text-slate-400 hover:text-slate-200'
                      }`}>
                      {env === 'live' ? '🟢 Live' : '🧪 Test'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleClose} className={`${btn.secondary} flex-1 justify-center`}>Cancel</button>
                <button type="submit" disabled={generateKey.isPending} className={`${btn.primary} flex-1 justify-center`}>
                  {generateKey.isPending ? 'Generating...' : 'Generate key'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Copy this key now. For security reasons, it <strong>will not be shown again</strong>.
                </p>
              </div>

              <div>
                <label className={label}>Your API Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#0e0e1a] border border-[#2a2a3a] rounded-lg px-3 py-2.5 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-nowrap">
                    {generatedKey}
                  </div>
                  <button onClick={handleCopy}
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1a1a28] border border-[#2a2a3a] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <button onClick={handleClose} className={`${btn.primary} w-full justify-center`}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}