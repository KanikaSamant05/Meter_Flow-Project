import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllKeys, useRevokeKey } from '../hooks/useApi';
import { Key, Trash2, Search, ArrowRight } from 'lucide-react';

export default function Keys() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useAllKeys();
  const revokeKey = useRevokeKey();

  const allKeys = data?.keys || [];
  const keys = allKeys.filter(k => {
    const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.prefix.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || k.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: allKeys.length,
    active: allKeys.filter(k => k.status === 'active').length,
    revoked: allKeys.filter(k => k.status === 'revoked').length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">API Keys</h1>
        <p className="text-slate-500 text-sm mt-1">All keys across your APIs</p>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search keys..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 bg-[#111118] border border-[#1e1e2e] rounded-lg p-1">
          {['all', 'active', 'revoked'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${filter === f ? 'bg-[#1e1e2e] text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-[#0e0e1a] rounded-lg animate-pulse" />)}</div>
        ) : keys.length === 0 ? (
          <div className="text-center py-16">
            <Key size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">{search || filter !== 'all' ? 'No keys match your filters' : 'No API keys yet'}</p>
            {!search && filter === 'all' && (
              <Link to="/apis" className="text-blue-400 text-xs hover:text-blue-300 mt-2 inline-flex items-center gap-1">
                Go to APIs to generate keys <ArrowRight size={11} />
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Name', 'Key prefix', 'API', 'Environment', 'Requests', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a28]">
              {keys.map(k => (
                <tr key={k._id} className="hover:bg-[#0e0e1a] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-200">{k.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Created {new Date(k.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3"><span className="mono text-xs text-slate-400">{k.prefix}{'•'.repeat(12)}</span></td>
                  <td className="px-4 py-3">
                    {k.api ? (
                      <Link to={`/apis/${k.api._id}`} className="text-xs text-blue-400 hover:text-blue-300">{k.api.name}</Link>
                    ) : <span className="text-xs text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${k.environment === 'live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
                      {k.environment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-300">{(k.totalRequests || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-600">${(k.totalCost || 0).toFixed(4)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={k.status === 'active' ? 'badge-active' : 'badge-revoked'}>{k.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {k.status === 'active' && (
                      <button onClick={() => { if (window.confirm(`Revoke key "${k.name}"?`)) revokeKey.mutate(k._id); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}