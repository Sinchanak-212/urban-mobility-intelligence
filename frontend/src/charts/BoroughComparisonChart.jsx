import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const BoroughComparisonChart = ({ data }) => {
  const COLORS = ['#0ea5e9', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#0d1322] border border-slate-700/80 p-3 shadow-2xl text-xs font-mono">
          <p className="font-bold text-slate-100 mb-1 flex items-center gap-1.5 font-sans">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || COLORS[0] }}></span>
            {item.borough}
          </p>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div>Trips: <span className="font-semibold text-white">{item.trips.toLocaleString()}</span> ({item.percentage}%)</div>
            <div>Avg Fare: <span className="font-semibold text-emerald-400">${item.avgFare.toFixed(2)}</span></div>
            <div>Avg Distance: <span className="font-semibold text-cyan-300">{item.avgDistance} mi</span></div>
            <div>Avg Duration: <span className="font-semibold text-indigo-300">{item.avgDuration} min</span></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="trips"
              nameKey="borough"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                  stroke="#111827"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="md:col-span-7 space-y-2">
        {data.map((b, i) => (
          <div
            key={b.borough}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-md shrink-0"
                style={{ backgroundColor: b.color || COLORS[i] }}
              />
              <div>
                <span className="font-semibold text-slate-200">{b.borough}</span>
                <span className="text-slate-500 text-[11px] ml-2">
                  {b.avgDistance} mi &bull; {b.avgDuration} min
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-slate-100 font-bold">{b.percentage}%</span>
              <span className="text-emerald-400 text-[11px] block">${b.avgFare.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoroughComparisonChart;
