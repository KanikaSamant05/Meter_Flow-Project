import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateApi, useUpdateApi } from '../hooks/useApi';
import { btn, input, label } from '../lib/styles';

const defaultForm = {
  name: '', description: '', baseUrl: '', version: 'v1',
  pricingModel: 'per_request', pricePerRequest: 0.001,
  rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 },
  tags: '',
};

export default function ApiModal({ open, onClose, existing }) {
  const [form, setForm] = useState(defaultForm);
  const createApi = useCreateApi();
  const updateApi = useUpdateApi();

  useEffect(() => {
    setForm(existing
      ? { ...defaultForm, ...existing, tags: existing.tags?.join(', ') || '' }
      : defaultForm
    );
  }, [existing, open]);

  if (!open) return null;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const setRL = (field, value) => setForm(f => ({ ...f, rateLimit: { ...f.rateLimit, [field]: Number(value) } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (existing) await updateApi.mutateAsync({ id: existing._id, ...payload });
    else await createApi.mutateAsync(payload);
    onClose();
  };

  const busy = createApi.isPending || updateApi.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#111118] border border-[#2a2a3a] rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
          <h2 className="text-sm font-semibold text-white">{existing ? 'Edit API' : 'Create new API'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className={label}>API Name *</label>
              <input className={input} placeholder="Image Recognition API"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>

            <div className="col-span-2">
              <label className={label}>Description</label>
              <textarea className={`${input} resize-none h-20`} placeholder="What does this API do?"
                value={form.description} onChange={e => set('description', e.target.value)} />
            </div>

            <div>
              <label className={label}>Base URL</label>
              <input className={input} placeholder="https://api.example.com"
                value={form.baseUrl} onChange={e => set('baseUrl', e.target.value)} />
            </div>

            <div>
              <label className={label}>Version</label>
              <input className={input} placeholder="v1"
                value={form.version} onChange={e => set('version', e.target.value)} />
            </div>

            <div>
              <label className={label}>Pricing Model</label>
              <select className={input} value={form.pricingModel} onChange={e => set('pricingModel', e.target.value)}>
                <option value="per_request">Per Request</option>
                <option value="flat_rate">Flat Rate</option>
                <option value="tiered">Tiered</option>
              </select>
            </div>

            <div>
              <label className={label}>Price per Request ($)</label>
              <input type="number" step="0.0001" min="0" className={input}
                value={form.pricePerRequest} onChange={e => set('pricePerRequest', parseFloat(e.target.value))} />
            </div>

            <div>
              <label className={label}>Rate Limit / Min</label>
              <input type="number" min="1" className={input}
                value={form.rateLimit.requestsPerMinute} onChange={e => setRL('requestsPerMinute', e.target.value)} />
            </div>

            <div>
              <label className={label}>Rate Limit / Day</label>
              <input type="number" min="1" className={input}
                value={form.rateLimit.requestsPerDay} onChange={e => setRL('requestsPerDay', e.target.value)} />
            </div>

            <div className="col-span-2">
              <label className={label}>Tags (comma separated)</label>
              <input className={input} placeholder="ml, vision, production"
                value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e1e2e]">
            <button type="button" onClick={onClose} className={btn.secondary}>Cancel</button>
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? 'Saving...' : existing ? 'Save changes' : 'Create API'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}