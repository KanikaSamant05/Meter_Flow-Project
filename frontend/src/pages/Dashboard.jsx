import { useAuth } from '../context/AuthContext';
import { useApis, useAllKeys } from '../hooks/useApi';
import { Code2, Key, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { card, btn, badge } from '../lib/styles';
import PokeAPIWidget from '../components/PokeAPIWidget';
import UsageChartWidget from '../components/UsageChartWidget';

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className={`${card} flex items-start justify-between`}>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: apisData } = useApis();
  const { data: keysData } = useAllKeys();

  const apis = apisData?.apis || [];
  const keys = keysData?.keys || [];
  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalRequests = apis.reduce((sum, a) => sum + (a.totalRequests || 0), 0);
  const totalRevenue = apis.reduce((sum, a) => sum + (a.totalRevenue || 0), 0);

  return (
    <div className="p-8">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your APIs.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total APIs"     value={apis.length}                    sub="across all projects"       icon={Code2}     color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Active Keys"    value={activeKeys}                     sub={`of ${keys.length} total`} icon={Key}       color="bg-emerald-500/10 text-emerald-400" />
        <StatCard label="Total Requests" value={totalRequests.toLocaleString()} sub="all time"                  icon={TrendingUp} color="bg-violet-500/10 text-violet-400" />
        <StatCard label="Revenue"        value={`$${totalRevenue.toFixed(4)}`}  sub="all time"                  icon={Zap}       color="bg-yellow-500/10 text-yellow-400" />
      </div>

      {/* Recent APIs + Recent Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent APIs */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Recent APIs</h2>
            <Link to="/apis" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {apis.length === 0 ? (
            <div className="text-center py-8">
              <Code2 size={28} className="text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No APIs yet</p>
              <Link to="/apis" className="text-blue-400 text-xs hover:text-blue-300 mt-1 inline-block">
                Create your first API →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {apis.slice(0, 5).map(api => (
                <Link key={api._id} to={`/apis/${api._id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e1a] hover:bg-[#12121f] border border-transparent hover:border-[#2a2a3a] transition-all group">
                  <div>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white">{api.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{api.version} · {api.pricingModel?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <span className={api.status === 'active' ? badge.active : badge.inactive}>{api.status}</span>
                    <p className="text-xs text-slate-500 mt-1">{api.totalRequests || 0} reqs</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Keys */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Recent Keys</h2>
            <Link to="/keys" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {keys.length === 0 ? (
            <div className="text-center py-8">
              <Key size={28} className="text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No keys yet</p>
              <p className="text-slate-600 text-xs mt-1">Create an API first, then generate keys</p>
            </div>
          ) : (
            <div className="space-y-2">
              {keys.slice(0, 5).map(k => (
                <div key={k._id} className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e1a] border border-transparent">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{k.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{k.prefix}••••••••</p>
                  </div>
                  <div className="text-right">
                    <span className={k.status === 'active' ? badge.active : badge.revoked}>{k.status}</span>
                    <p className="text-xs text-slate-500 mt-1">{k.environment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Get started banner — only shown when no APIs exist */}
      {apis.length === 0 && (
        <div className="mt-6 bg-blue-500/5 border border-dashed border-blue-500/20 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Get started in 2 minutes</h3>
              <p className="text-xs text-slate-500 mb-3">Create your first API, generate a key, and start metering requests.</p>
              <Link to="/apis" className={btn.primary}>Create your first API <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      )}

      {/* Usage chart + PokéAPI demo widgets — always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UsageChartWidget />
        <PokeAPIWidget />
      </div>

    </div>
  );
}