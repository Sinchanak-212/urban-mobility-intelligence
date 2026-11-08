import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const DistributionChart = ({
  data,
  dataKey = 'count',
  nameKey = 'range',
  fillColor = '#0ea5e9',
  unit = 'trips',
  height = 240
}) => {
  const formatYAxis = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#0d1322] border border-slate-700/80 p-3 shadow-2xl text-xs font-mono">
          <p className="font-bold text-slate-100 mb-1">{label}</p>
          <div className="text-cyan-300">
            Count: <span className="font-bold text-white">{item[dataKey].toLocaleString()}</span> {unit}
          </div>
          {item.percentage && (
            <div className="text-slate-400 text-[11px] mt-0.5">
              Share: {item.percentage}%
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
          <XAxis
            dataKey={nameKey}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={formatYAxis}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 1 ? '#06b6d4' : fillColor}
                opacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
