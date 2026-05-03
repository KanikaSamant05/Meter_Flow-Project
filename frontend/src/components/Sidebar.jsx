import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LayoutDashboard, Code2, Key, BarChart2, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/apis',      icon: Code2,           label: 'APIs' },
  { to: '/keys',      icon: Key,             label: 'API Keys' },
  { to: '/usage',     icon: BarChart2,       label: 'Usage' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-56 min-h-screen bg-[#0d0d16] border-r border-[#1e1e2e] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e1e2e]">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-semibold text-white">MeterFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a28]'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1e1e2e] space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a28]'
            }`
          }
        >
          <Settings size={15} />
          Settings
        </NavLink>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>

        <div className="mt-3 flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-400">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-600 truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}