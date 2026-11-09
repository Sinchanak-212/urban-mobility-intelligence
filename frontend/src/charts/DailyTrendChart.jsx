
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DailyTrendChart = ({ data = [] }) => {
  const formatTripCount = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2d42"
            vertical={false}
          />

          <XAxis
            dataKey="day_name"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />

          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={formatTripCount}
          />

          <Tooltip
            formatter={(value) => [
              Number(value).toLocaleString(),
              'Total Trips'
            ]}
            contentStyle={{
              backgroundColor: '#0d1322',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#f1f5f9'
            }}
          />

          <Bar
            dataKey="total_trips"
            name="Daily Trips"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyTrendChart;
