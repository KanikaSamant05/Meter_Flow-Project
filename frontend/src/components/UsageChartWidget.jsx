import { useState, useMemo } from "react";

// ── Mock data generator ──────────────────────────────────────────────────────
function generateData(days) {
  const now   = new Date();
  const data  = [];
  let cumCost = 0;
  for (let i = days - 1; i >= 0; i--) {
    const date  = new Date(now);
    date.setDate(date.getDate() - i);
    const calls = Math.floor(Math.random() * 180 + 20);
    const cost  = +(calls * 0.0019).toFixed(4);
    cumCost    += cost;
    data.push({
      date:    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      calls,
      cost:    +cost.toFixed(4),
      cumCost: +cumCost.toFixed(4),
    });
  }
  return data;
}

const RANGES = [
  { label: "7d",  days: 7  },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
];

const METRICS = [
  { key: "calls",   label: "API Calls",    color: "#4ade80", fmt: v => v.toLocaleString() },
  { key: "cost",    label: "Daily Cost",   color: "#f87171", fmt: v => `$${v.toFixed(4)}` },
  { key: "cumCost", label: "Cumulative $", color: "#60a5fa", fmt: v => `$${v.toFixed(4)}` },
];

// ── SVG bar chart ────────────────────────────────────────────────────────────
function BarChart({ data, metricKey, color }) {
  const W = 600, H = 150, PX = 4, PY = 12, BOTTOM = 20;
  const vals   = data.map(d => d[metricKey]);
  const maxVal = Math.max(...vals) || 1;
  const chartH = H - PY - BOTTOM;

  const totalBars = data.length;
  const barW      = Math.max(4, (W - PX * 2) / totalBars - 2);
  const gap       = (W - PX * 2 - barW * totalBars) / (totalBars - 1 || 1);

  const [hover, setHover] = useState(null);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 150 }}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id={`bgrad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Baseline */}
      <line x1={PX} y1={H - BOTTOM} x2={W - PX} y2={H - BOTTOM} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Bars */}
      {data.map((d, i) => {
        const barH  = Math.max(2, (d[metricKey] / maxVal) * chartH);
        const x     = PX + i * (barW + gap);
        const y     = PY + chartH - barH;
        const isHov = hover?.i === i;

        return (
          <g key={i}>
            {/* Hover bg */}
            <rect
              x={x - 1} y={PY} width={barW + 2} height={chartH}
              fill={isHov ? "rgba(255,255,255,0.03)" : "transparent"}
              rx="3"
            />
            {/* Bar */}
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={isHov ? color : `url(#bgrad-${metricKey})`}
              fillOpacity={isHov ? 1 : 0.7}
              rx="2"
              style={{ transition: "fill-opacity 0.15s" }}
            />
            {/* Hover zone */}
            <rect
              x={x - gap / 2} y={0} width={barW + gap} height={H}
              fill="transparent"
              onMouseEnter={() => setHover({ i, x: x + barW / 2, y, d })}
            />
          </g>
        );
      })}

      {/* Tooltip */}
      {hover && (() => {
        const metric = METRICS.find(m => m.key === metricKey);
        const tx = Math.min(Math.max(hover.x - 44, 2), W - 92);
        const ty = Math.max(hover.y - 38, 2);
        return (
          <g>
            <rect x={tx} y={ty} width={88} height={28} rx="4" fill="#111" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
            <text x={tx + 44} y={ty + 11} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">{hover.d.date}</text>
            <text x={tx + 44} y={ty + 22} textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace" fontWeight="600">
              {metric.fmt(hover.d[metricKey])}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ── Main widget ──────────────────────────────────────────────────────────────
export default function UsageChartWidget() {
  const [rangeIdx,  setRangeIdx]  = useState(0);
  const [metricIdx, setMetricIdx] = useState(0);

  const data   = useMemo(() => generateData(RANGES[rangeIdx].days), [rangeIdx]);
  const metric = METRICS[metricIdx];

  const total      = data.reduce((s, d) => s + d.calls, 0);
  const totalCost  = data.reduce((s, d) => s + d.cost,  0);
  const avgCalls   = Math.round(total / data.length);
  const peakDay    = data.reduce((a, b) => a.calls > b.calls ? a : b);

  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
          <span className="text-white text-sm font-medium tracking-tight">Usage Overview</span>
        </div>

        {/* Range selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setRangeIdx(i)}
              className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                rangeIdx === i
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 divide-x divide-white/[0.06] border-b border-white/[0.06]">
        {[
          { label: "Total calls",  value: total.toLocaleString(),       color: "text-white" },
          { label: "Total cost",   value: `$${totalCost.toFixed(4)}`,   color: "text-red-400" },
          { label: "Avg / day",    value: avgCalls.toLocaleString(),    color: "text-white/70" },
          { label: "Peak day",     value: peakDay.calls.toLocaleString(), sub: peakDay.date, color: "text-green-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="px-4 py-3">
            <p className="text-[10px] text-white/25 font-mono uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-sm font-mono font-semibold ${color}`}>{value}</p>
            {sub && <p className="text-[10px] text-white/20 font-mono mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Metric tabs */}
      <div className="flex gap-0 px-5 pt-4 mb-2">
        {METRICS.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setMetricIdx(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all mr-1 ${
              metricIdx === i
                ? "bg-white/[0.06] text-white"
                : "text-white/25 hover:text-white/50"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: metricIdx === i ? m.color : "rgba(255,255,255,0.15)" }}
            />
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-4 pb-1">
        <BarChart data={data} metricKey={metric.key} color={metric.color} />
      </div>

      {/* X axis labels */}
      <div className="flex justify-between px-5 pb-4">
        {[data[0], data[Math.floor(data.length / 2)], data[data.length - 1]].map((d, i) => (
          <span key={i} className="text-[10px] text-white/20 font-mono">{d.date}</span>
        ))}
      </div>
    </div>
  );
}