import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  Activity
} from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import mobilityApi from '../services/api';
import { useAnalytics } from '../context/AnalyticsContext';
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

const isNumericValue = (value) =>
  value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

const formatCount = (value) => {
  if (!isNumericValue(value)) return 'Not available';
  return Number(value).toLocaleString('en-US');
};

const NYC_BOROUGHS = new Set(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']);

export const DemandForecasting = () => {
  const { borough, refreshKey } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setData(null);

    mobilityApi.getHistoricalDemand()
      .then((res) => {
        if (isMounted) {
          setData({
            hourlyDemand: Array.isArray(res?.hourlyDemand) ? res.hourlyDemand.filter(Boolean) : [],
            dailyDemand: Array.isArray(res?.dailyDemand) ? res.dailyDemand.filter(Boolean) : [],
            boroughDemand: Array.isArray(res?.boroughDemand) ? res.boroughDemand.filter(Boolean) : []
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.response?.data?.detail || err?.message || 'Unable to load historical demand data.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey, retryKey]);

  if (isLoading) {
    return <Loading message="Loading January 2025 historical demand analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setRetryKey((key) => key + 1)} />;
  }

  const hourlyDemand = (data?.hourlyDemand ?? [])
    .filter((row) => isNumericValue(row.pickup_hour) && isNumericValue(row.total_trips))
    .map((row) => ({ ...row, pickup_hour: Number(row.pickup_hour), total_trips: Number(row.total_trips) }))
    .sort((a, b) => a.pickup_hour - b.pickup_hour);
  const dailyDemand = (data?.dailyDemand ?? [])
    .filter((row) => row.day_name && isNumericValue(row.total_trips))
    .map((row) => ({ ...row, total_trips: Number(row.total_trips) }))
    .sort((a, b) => Number(a.day_number) - Number(b.day_number));
  const allBoroughDemand = (data?.boroughDemand ?? [])
    .filter((row) => NYC_BOROUGHS.has(row.pickup_borough) && isNumericValue(row.total_trips))
    .map((row) => ({ ...row, total_trips: Number(row.total_trips) }));
  const selectedBoroughDemand =
    borough && borough !== 'all'
      ? allBoroughDemand.filter((row) => row.pickup_borough.toLowerCase() === borough.toLowerCase())
      : allBoroughDemand;
  const hourlyPeak = hourlyDemand.reduce(
    (peak, row) => (row.total_trips > (peak?.total_trips ?? -1) ? row : peak),
    null
  );
  const dailyPeak = dailyDemand.reduce(
    (peak, row) => (row.total_trips > (peak?.total_trips ?? -1) ? row : peak),
    null
  );
  const boroughPeak = selectedBoroughDemand.reduce(
    (peak, row) => (row.total_trips > (peak?.total_trips ?? -1) ? row : peak),
    null
  );
  const totalHistoricalTrips = hourlyDemand.reduce((total, row) => total + row.total_trips, 0);
  const hasHistoricalData = hourlyDemand.length > 0 || dailyDemand.length > 0 || allBoroughDemand.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Demand Forecasting
            </h1>
            <Badge variant="primary" size="sm">
              Historical Demand
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explore observed NYC TLC trip demand from January 2025. Future predictions are not available.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          Dataset: <span className="text-cyan-400">NYC TLC HVFHV · January 2025</span>
        </div>
      </div>

      {!hasHistoricalData && (
        <ErrorState
          title="No historical demand data available"
          message="The demand endpoints returned no usable records."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}

      {/* Historical Demand Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Historical Trips"
          value={hourlyDemand.length ? formatCount(totalHistoricalTrips) : 'Not available'}
          unit="January records"
          subtitle="Sum of hourly observed trips"
          icon={Activity}
          accentColor="cyan"
          tooltip="Total from the observed hourly demand aggregates"
        />
        <KPICard
          title="Peak Demand Hour"
          value={hourlyPeak ? `${String(hourlyPeak.pickup_hour).padStart(2, '0')}:00` : 'Not available'}
          unit={hourlyPeak ? `${formatCount(hourlyPeak.total_trips)} trips` : ''}
          subtitle="Highest observed hourly volume"
          icon={Clock}
          accentColor="blue"
          tooltip="Peak derived from the historical hourly demand response"
        />
        <KPICard
          title="Highest Weekday Total"
          value={dailyPeak?.day_name || 'Not available'}
          unit={dailyPeak ? `${formatCount(dailyPeak.total_trips)} trips` : ''}
          subtitle="Grouped total across January"
          icon={Calendar}
          accentColor="emerald"
          tooltip="Highest aggregate total among day-of-week groups; not a per-day average"
        />
        <KPICard
          title="Top Pickup Borough"
          value={boroughPeak?.pickup_borough || 'Not available'}
          unit={boroughPeak ? `${formatCount(boroughPeak.total_trips)} trips` : ''}
          subtitle="Observed pickup volume"
          icon={MapPin}
          accentColor="purple"
          tooltip="Top borough in the current borough selection"
        />
      </div>

      {/* Observed Hourly Demand */}
      <ChartCard
        title="Hourly Historical Demand"
        subtitle="Observed trips grouped by pickup hour (not a future forecast)"
        icon={Clock}
        badge={<Badge variant="primary" size="xs">Historical · 24 Hours</Badge>}
      >
        {hourlyDemand.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-sm text-slate-400">
            Hourly demand data is not available.
          </div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDemand} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
                <XAxis
                  dataKey="pickup_hour"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(hour) => `${String(hour).padStart(2, '0')}:00`}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) => formatCount(value)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload;
                      if (!item) return null;
                      return (
                        <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-3 shadow-xl text-xs font-mono">
                          <p className="font-bold text-slate-100 font-sans mb-1">
                            {String(label).padStart(2, '0')}:00 · Historical
                          </p>
                          <div className="text-cyan-400">
                            Observed trips: {formatCount(item.total_trips)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="total_trips"
                  name="Observed trips"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* Weekday and Borough Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Historical Demand by Day of Week"
          subtitle="January trip totals grouped by pickup weekday"
          icon={Calendar}
          badge={<Badge variant="primary" size="xs">Historical · 7 Days</Badge>}
        >
          {dailyDemand.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-sm text-slate-400">
              Daily demand data is not available.
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyDemand} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
                  <XAxis dataKey="day_name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => formatCount(value)}
                  />
                  <Tooltip
                    formatter={(value) => [formatCount(value), 'Observed trips']}
                    contentStyle={{
                      backgroundColor: '#0d1322',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      color: '#e2e8f0'
                    }}
                  />
                  <Bar dataKey="total_trips" name="Observed trips" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {dailyDemand.map((row) => (
                      <Cell
                        key={row.day_number}
                        fill={row.day_name === dailyPeak?.day_name ? '#06b6d4' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Historical Demand by Borough"
          subtitle={borough === 'all' ? 'Observed pickup trip totals by borough' : `Observed pickup trips · ${borough}`}
          icon={MapPin}
          badge={<Badge variant="primary" size="xs">Historical Boroughs</Badge>}
        >
          {selectedBoroughDemand.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-sm text-slate-400">
              Borough demand data is not available for this selection.
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={selectedBoroughDemand}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => formatCount(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="pickup_borough"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value, name, payload) => [
                      `${formatCount(value)} trips${isNumericValue(payload?.payload?.percentage) ? ` (${payload.payload.percentage}%)` : ''}`,
                      'Observed demand'
                    ]}
                    contentStyle={{
                      backgroundColor: '#0d1322',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      color: '#e2e8f0'
                    }}
                  />
                  <Bar dataKey="total_trips" name="Observed trips" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-100">Forecasting model not yet implemented</p>
          <p className="leading-relaxed">
            This page currently presents historical January 2025 demand only. No predictions, model accuracy scores, or confidence intervals are available.
          </p>
          <p className="leading-relaxed text-slate-400">
            The backend aggregates are dataset-wide and do not support date-range or provider filters. The borough selector filters only the borough comparison; hourly and weekday charts remain dataset-wide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemandForecasting;
