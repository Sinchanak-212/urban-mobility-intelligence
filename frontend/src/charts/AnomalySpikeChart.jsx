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

export const AnomalySpikeChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#0d1322] border border-slate-700/80 p-3 shadow-2xl text-xs font-mono">
          <p className="font-bold text-slate-100 mb-1 font-sans">{item.zone}</p>
          <div className="text-rose-400 font-bold text-sm">
            Demand Surge: {item.spikeFactor}
          </div>
          <div className="text-slate-300 text-[11px] mt-1 space-y-0.5">
            <div>Observed: <span className="font-bold text-white">{item.observedPerHour} trips/hr</span></div>
            <div>Baseline: <span className="text-slate-400">{item.baselinePerHour} trips/hr</span></div>
            <div className="text-amber-300 text-[10px] mt-1 italic font-sans">{item.reason}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" horizontal={false} />
          <XAxis
            type="number"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <YAxis
            type="category"
            dataKey="zone"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            width={120}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="observedPerHour" fill="#f43f5e" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#f43f5e' : index === 1 ? '#f59e0b' : '#0ea5e9'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalySpikeChart;
