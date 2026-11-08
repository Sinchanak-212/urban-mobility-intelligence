import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const DailyTrendChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-[#0d1322] border border-slate-700/80 p-3 shadow-2xl text-xs">
          <p className="font-semibold text-slate-200 mb-1.5">{label}</p>
          <div className="space-y-1 font-mono text-[11px]">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-bold text-slate-100">
                  {entry.name === 'Average Fare'
                    ? `$${Number(entry.value).toFixed(2)}`
                    : Number(entry.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatTripCount = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <YAxis
            yAxisId="left"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={formatTripCount}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#64748b"
            domain={[20, 35]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v) => `$${v}`}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Bar
            yAxisId="left"
            name="Daily Trips"
            dataKey="trips"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Line
            yAxisId="right"
            type="monotone"
            name="Average Fare"
            dataKey="avgFare"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 2, fill: '#10b981' }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyTrendChart;
