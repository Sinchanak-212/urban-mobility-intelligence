import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ForecastComparisonChart = ({ data }) => {
  const formatYAxis = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-[#0d1322] border border-slate-700/80 p-3 shadow-2xl text-xs font-mono">
          <p className="font-bold text-slate-100 mb-1.5 font-sans flex items-center justify-between">
            <span>Horizon: {label}</span>
          </p>
          <div className="space-y-1 text-[11px]">
            {payload.map((entry, index) => {
              if (entry.dataKey === 'lowerBound' || entry.dataKey === 'upperBound') return null;
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span style={{ color: entry.color }}>{entry.name}:</span>
                  <span className="font-bold text-slate-100">
                    {entry.value !== null && entry.value !== undefined
                      ? `${entry.value.toLocaleString()} trips`
                      : 'N/A (Future)'}
                  </span>
                </div>
              );
            })}
            {payload[0]?.payload?.lowerBound && (
              <div className="pt-1 mt-1 border-t border-slate-800 text-[10px] text-slate-400">
                95% CI: [{payload[0].payload.lowerBound.toLocaleString()} - {payload[0].payload.upperBound.toLocaleString()}]
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={formatYAxis}
            domain={['auto', 'auto']}
            axisLine={{ stroke: '#1f2d42' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          {/* 95% Confidence Interval Band */}
          <Area
            type="monotone"
            name="95% Confidence Band"
            dataKey="upperBound"
            stroke="#3b82f6"
            strokeDasharray="3 3"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#confidenceBand)"
          />
          {/* Actual Historical Line */}
          <Line
            type="monotone"
            name="Actual Spark Records"
            dataKey="actual"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#0ea5e9' }}
            connectNulls={false}
          />
          {/* Predicted Demand Line */}
          <Line
            type="monotone"
            name="PySpark GBDT Forecast"
            dataKey="predicted"
            stroke="#06b6d4"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#06b6d4' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastComparisonChart;
