import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApis, useDeleteApi } from '../hooks/useApi';
import ApiModal from '../components/ApiModal';
import { Plus, Code2, Search, MoreHorizontal, Pencil, Trash2, Key, ArrowRight } from 'lucide-react';
import { btn, card, input, badge } from '../lib/styles';

function ApiCard({ api, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`${card} hover:border-[#2a2a3a] transition-all relative`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Code2 size={15} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{api.name}</h3>
            <p className="text-xs text-slate-500">{api.version} · {api.pricingModel?.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={api.status === 'active' ? badge.active : api.status === 'deprecated' ? badge.revoked : badge.inactive}>
            <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            {api.status}
          </span>
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-[#1a1a28] transition-all">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 bg-[#16161f] border border-[#2a2a3a] rounded-xl shadow-xl py-1">
                  <button onClick={() => { onEdit(api); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-[#1e1e2e] transition-colors">
                    <Pencil size={12} /> Edit API
                  </button>
                  <button onClick={() => { if (window.confirm('Delete this API and all its keys?')) onDelete(api._id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/5 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {api.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{api.description}</p>}

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          ['Requests', (api.totalRequests || 0).toLocaleString()],
          ['Revenue',  `$${(api.totalRevenue || 0).toFixed(3)}`],
          ['Price/req', `$${api.pricePerRequest}`],
        ].map(([lbl, val]) => (
          <div key={lbl} className="bg-[#0e0e1a] rounded-lg p-2.5">
            <p className="text-xs text-slate-500">{lbl}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{val}</p>
          </div>
        ))}
      </div>

      {api.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {api.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a28] border border-[#2a2a3a] text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link to={`/apis/${api._id}`} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
        <Key size={11} /> Manage keys <ArrowRight size={11} />
      </Link>
    </div>
  );
}

export default function Apis() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const { data, isLoading } = useApis();
  const deleteApi = useDeleteApi();

  const apis = (data?.apis || []).filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">APIs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your API products and pricing</p>
        </div>
        <button onClick={() => setModalOpen(true)} className={btn.primary}>
          <Plus size={15} /> New API
        </button>
      </div>

      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className={`${input} pl-9`} placeholder="Search APIs..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 animate-pulse h-52" />)}
        </div>
      ) : apis.length === 0 ? (
        <div className="text-center py-20">
          <Code2 size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">{search ? 'No APIs match your search' : 'No APIs yet'}</p>
          {!search && (
            <button onClick={() => setModalOpen(true)} className={`${btn.primary} mx-auto mt-4`}>
              <Plus size={14} /> Create API
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {apis.map(api => (
            <ApiCard key={api._id} api={api}
              onEdit={(api) => { setEditTarget(api); setModalOpen(true); }}
              onDelete={deleteApi.mutate}
            />
          ))}
        </div>
      )}

      <ApiModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} existing={editTarget} />
    </div>
  );
}