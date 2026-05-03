import { BarChart2 } from 'lucide-react';

export default function Usage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Usage</h1>
        <p className="text-slate-500 text-sm mt-1">Request analytics and billing overview</p>
      </div>
      <div className="card text-center py-20">
        <BarChart2 size={40} className="text-slate-700 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">Usage analytics coming soon</p>
        <p className="text-slate-600 text-sm mt-1">Day 5–6: Charts, per-key breakdowns, billing export</p>
      </div>
    </div>
  );
}