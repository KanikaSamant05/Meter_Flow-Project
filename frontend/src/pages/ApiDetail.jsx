import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi, useApiKeys, useRevokeKey, useDeleteApi } from '../hooks/useApi';
import GenerateKeyModal from '../components/GenerateKeyModal';
import ApiModal from '../components/ApiModal';
import { ArrowLeft, Plus, Key, Trash2, RefreshCw, Globe, DollarSign, Activity, Pencil } from 'lucide-react';
import { btn, card, badge } from '../lib/styles';

function KeyRow({ k, onRevoke }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e1a] border border-[#1a1a28] hover:border-[#2a2a3a] transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${k.status === 'active' ? 'bg-emerald-500/10' : 'bg-slate-500/10'}`}>
          <Key size={13} className={k.status === 'active' ? 'text-emerald-400' : 'text-slate-500'} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200">{k.name}</p>
          <p className="text-xs text-slate-500 font-mono truncate">{k.prefix}{'•'.repeat(20)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 ml-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">{k.totalRequests || 0} reqs</p>
          <p className="text-xs text-slate-600">${(k.totalCost || 0).toFixed(4)}</p>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium hidden sm:block ${k.environment === 'live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
          {k.environment}
        </span>
        <span className={k.status === 'active' ? badge.active : badge.revoked}>{k.status}</span>
        {k.status === 'active' && (
          <button onClick={() => { if (window.confirm(`Revoke key "${k.name}"? This cannot be undone.`)) onRevoke(k._id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ApiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApi(id);
  const { data: keysData, isLoading: keysLoading } = useApiKeys(id);
  const revokeKey = useRevokeKey();
  const deleteApi = useDeleteApi();
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) return (
    <div className="p-8 animate-pulse space-y-4">
      <div className="h-6 w-48 bg-[#1a1a28] rounded" />
      <div className="h-32 bg-[#111118] rounded-xl" />
    </div>
  );

  const api = data?.api;
  const keys = keysData?.keys || [];
  const activeKeys = keys.filter(k => k.status === 'active');
  const revokedKeys = keys.filter(k => k.status !== 'active');

  if (!api) return (
    <div className="p-8 text-center">
      <p className="text-slate-400">API not found.</p>
      <Link to="/apis" className="text-blue-400 text-sm mt-2 inline-block">← Back to APIs</Link>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <Link to="/apis" className="mt-0.5 text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-white">{api.name}</h1>
              <span className={api.status === 'active' ? badge.active : badge.inactive}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{api.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">{api.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditModalOpen(true)} className={btn.secondary}><Pencil size={13} /> Edit</button>
          <button onClick={() => { if (window.confirm('Delete this API and revoke all its keys?')) deleteApi.mutate(api._id, { onSuccess: () => navigate('/apis') }); }} className={btn.danger}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Activity,   label: 'Total Requests',  value: (api.totalRequests || 0).toLocaleString(), color: 'text-blue-400' },
          { icon: DollarSign, label: 'Revenue',          value: `$${(api.totalRevenue || 0).toFixed(4)}`, color: 'text-emerald-400' },
          { icon: RefreshCw,  label: 'Rate Limit / min', value: api.rateLimit?.requestsPerMinute || 60,   color: 'text-violet-400' },
          { icon: Globe,      label: 'Price / Request',  value: `$${api.pricePerRequest}`,                color: 'text-yellow-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={card}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={13} className={color} />
              <p className="text-xs text-slate-500">{label}</p>
            </div>
            <p className="text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {(api.baseUrl || api.tags?.length > 0) && (
        <div className={`${card} mb-6 flex flex-wrap gap-6`}>
          {api.baseUrl && (
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-slate-500" />
              <span className="text-xs text-slate-400 font-mono">{api.baseUrl}</span>
            </div>
          )}
          {api.tags?.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a28] border border-[#2a2a3a] text-slate-400">{tag}</span>
          ))}
        </div>
      )}

      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">API Keys</h2>
            <p className="text-xs text-slate-500 mt-0.5">{activeKeys.length} active · {revokedKeys.length} revoked</p>
          </div>
          <button onClick={() => setKeyModalOpen(true)} className={btn.primary}><Plus size={14} /> Generate key</button>
        </div>

        {keysLoading ? (
          <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-14 bg-[#0e0e1a] rounded-lg animate-pulse" />)}</div>
        ) : keys.length === 0 ? (
          <div className="text-center py-10">
            <Key size={28} className="text-slate-700 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No keys yet</p>
            <p className="text-slate-600 text-xs mt-1">Generate a key to start making authenticated requests</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeKeys.length > 0 && <>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider px-1 mb-1">Active</p>
              {activeKeys.map(k => <KeyRow key={k._id} k={k} onRevoke={revokeKey.mutate} />)}
            </>}
            {revokedKeys.length > 0 && <>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider px-1 mt-4 mb-1">Revoked</p>
              {revokedKeys.map(k => <KeyRow key={k._id} k={k} onRevoke={revokeKey.mutate} />)}
            </>}
          </div>
        )}
      </div>

      <GenerateKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} apiId={id} apiName={api.name} />
      <ApiModal open={editModalOpen} onClose={() => setEditModalOpen(false)} existing={api} />
    </div>
  );
}