import React, { useState, useEffect } from 'react';
import {
  Clock,
  Navigation,
  Compass,
  Layers,
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

const formatNumber = (value, fractionDigits = 2) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString('en-US', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      })
    : 'Not available';
};

const formatCount = (value) => {
  if (value === null || value === undefined || value === '') return 'Not available';
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-US') : 'Not available';
};

const isNumericValue = (value) =>
  value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

export const TravelBehaviour = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distTab, setDistTab] = useState('distance');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setData(null);

    Promise.all([
      mobilityApi.getBehaviour({ dateRange, borough, provider }),
      mobilityApi.getBehaviourByBorough({ dateRange, borough, provider }),
      mobilityApi.getBehaviourByHour({ dateRange, borough, provider }),
      mobilityApi.getWeekdayWeekend({ dateRange, borough, provider })
    ])
      .then(([summary, boroughs, hourly, weekdayWeekend]) => {
        if (isMounted) {
          setData({
            summary: summary && typeof summary === 'object' ? summary : null,
            boroughs: Array.isArray(boroughs) ? boroughs.filter(Boolean) : [],
            hourly: Array.isArray(hourly) ? hourly.filter(Boolean) : [],
            weekdayWeekend: Array.isArray(weekdayWeekend) ? weekdayWeekend.filter(Boolean) : []
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.response?.data?.detail || err?.message || 'Unable to load travel behaviour data.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dateRange, borough, provider, refreshKey, retryKey]);

  if (isLoading) {
    return <Loading message="Loading January 2025 travel behaviour analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setRetryKey((key) => key + 1)} />;
  }

  const summary = data?.summary;
  const boroughs = data?.boroughs ?? [];
  const hourly = (data?.hourly ?? []).filter(
    (item) => isNumericValue(item.pickup_hour) && isNumericValue(item.total_trips)
  );
  const weekdayWeekend = data?.weekdayWeekend ?? [];
  const hasData =
    Boolean(summary && Object.keys(summary).length > 0) ||
    boroughs.length > 0 ||
    hourly.length > 0 ||
    weekdayWeekend.length > 0;
  const boroughData = boroughs
    .filter((item) => item.pickup_borough && isNumericValue(item.avg_duration_minutes))
    .map((item) => ({
      ...item,
      avg_duration_minutes: Number(item.avg_duration_minutes)
    }));
  const distanceSummary = [
    { metric: 'Average', value: summary?.average_distance_miles },
    { metric: 'Median', value: summary?.median_distance_miles },
    { metric: 'Minimum', value: summary?.minimum_distance },
    { metric: 'Maximum', value: summary?.maximum_distance }
  ]
    .filter((item) => isNumericValue(item.value))
    .map((item) => ({ ...item, value: Number(item.value) }));
  const durationSummary = [
    { metric: 'Average', value: summary?.average_duration_minutes },
    { metric: 'Median', value: summary?.median_duration_minutes }
  ]
    .filter((item) => isNumericValue(item.value))
    .map((item) => ({ ...item, value: Number(item.value) }));
  const summaryChartData = distTab === 'distance' ? distanceSummary : durationSummary;

  return (
    <div className="space-y-6">
      {!hasData && (
        <ErrorState
          title="No travel behaviour data available"
          message="The API returned no January 2025 travel behaviour records."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Travel Behaviour
            </h1>
            <Badge variant="indigo" size="sm">
              January 2025 TLC Data
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Travel distance and duration summaries, hourly patterns, borough comparisons, and weekday/weekend trip volume.
          </p>
        </div>
      </div>

      {/* Travel Behaviour Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Valid Trips"
          value={formatCount(summary?.valid_trips)}
          unit="trips"
          subtitle="Positive distance and duration"
          icon={Activity}
          accentColor="cyan"
          tooltip="Trips with positive distance and duration, as defined by the backend"
        />
        <KPICard
          title="Average Distance"
          value={formatNumber(summary?.average_distance_miles)}
          unit="miles"
          subtitle="Across valid trips"
          icon={Navigation}
          accentColor="blue"
        />
        <KPICard
          title="Average Duration"
          value={formatNumber(summary?.average_duration_minutes)}
          unit="minutes"
          subtitle="Across valid trips"
          icon={Clock}
          accentColor="emerald"
        />
        <KPICard
          title="Median Distance"
          value={formatNumber(summary?.median_distance_miles)}
          unit="miles"
          subtitle={`Median duration: ${formatNumber(summary?.median_duration_minutes)} min`}
          icon={Compass}
          accentColor="purple"
        />
      </div>

      {/* Hourly Travel Patterns */}
      <ChartCard
        title="Hourly Mobility Patterns"
        subtitle="Valid trip volume by pickup hour; average duration and distance are available in the tooltip"
        icon={Clock}
        badge={<Badge variant="primary" size="xs">24-Hour Breakdown</Badge>}
      >
        {hourly.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400">
            Hourly travel data is not available.
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
                <XAxis
                  dataKey="pickup_hour"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={formatCount}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload;
                      if (!item) return null;
                      return (
                        <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-2.5 text-xs font-mono">
                          <div className="font-bold text-white">{label}:00</div>
                          <div className="text-cyan-400">Trips: {formatCount(item.total_trips)}</div>
                          <div className="text-indigo-300">
                            Avg Duration: {formatNumber(item.avg_duration_minutes)} min
                          </div>
                          <div className="text-slate-400">
                            Avg Distance: {formatNumber(item.avg_distance_miles)} mi
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total_trips" name="total_trips" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* Trip Summary and Borough Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Toggleable Trip Summary Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title={
              distTab === 'distance'
                ? 'Trip Distance Summary (Miles)'
                : distTab === 'duration'
                ? 'Trip Duration Summary (Minutes)'
                : 'Passenger Fare'
            }
            subtitle={
              distTab === 'fare'
                ? 'Fare metrics are not included in the available backend response.'
                : 'Backend-provided average, median, minimum, and maximum values'
            }
            icon={Layers}
            action={
              <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
                <button
                  onClick={() => setDistTab('distance')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    distTab === 'distance'
                      ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Distance
                </button>
                <button
                  onClick={() => setDistTab('duration')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    distTab === 'duration'
                      ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Duration
                </button>
                <button
                  onClick={() => setDistTab('fare')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    distTab === 'fare'
                      ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fare
                </button>
              </div>
            }
          >
            {distTab === 'fare' ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
                Not yet implemented: fare data is not provided by the travel behaviour API.
              </div>
            ) : summaryChartData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
                {distTab === 'distance' ? 'Distance' : 'Duration'} summary data is not available.
              </div>
            ) : (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
                    <XAxis
                      dataKey="metric"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${formatNumber(value)} ${distTab === 'distance' ? 'miles' : 'minutes'}`,
                        distTab === 'distance' ? 'Distance' : 'Duration'
                      ]}
                      contentStyle={{
                        backgroundColor: '#0d1322',
                        border: '1px solid #334155',
                        borderRadius: '0.75rem',
                        color: '#e2e8f0'
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Value"
                      fill={distTab === 'distance' ? '#0ea5e9' : '#6366f1'}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={56}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Average Duration by Borough */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Trip Duration by Borough"
            subtitle="Comparing backend aggregates for valid trips by pickup borough"
            icon={Navigation}
            badge={<Badge variant="amber" size="xs">Pickup Borough</Badge>}
          >
            {boroughData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
                Borough travel data is not available.
              </div>
            ) : (
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={boroughData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="pickup_borough"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      width={110}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0]?.payload;
                          if (!item) return null;
                          return (
                            <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-2.5 text-xs font-mono">
                              <div className="font-bold text-white">{item.pickup_borough}</div>
                              <div className="text-cyan-400">
                                Avg Duration: {formatNumber(item.avg_duration_minutes)} min
                              </div>
                              <div className="text-slate-400">
                                Avg Distance: {formatNumber(item.avg_distance_miles)} mi
                              </div>
                              <div className="text-slate-400">
                                Trips: {formatCount(item.total_trips)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="avg_duration_minutes" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                      {boroughData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Number(entry.avg_duration_minutes) > 30 ? '#06b6d4' : '#1e293b'}
                          stroke={Number(entry.avg_duration_minutes) > 30 ? '#22d3ee' : '#334155'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Weekday and Weekend Comparison */}
      <ChartCard
        title="Weekday vs Weekend Travel"
        subtitle="Trip totals and average daily trips from the January 2025 dataset"
        icon={Clock}
        badge={<Badge variant="primary" size="xs">Day Type</Badge>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Day Type</th>
                <th className="py-3 px-4 text-right">Days in Dataset</th>
                <th className="py-3 px-4 text-right">Total Trips</th>
                <th className="py-3 px-4 text-right">Average Trips / Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {weekdayWeekend.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 px-4 text-center text-slate-400">
                    Weekday/weekend data is not available.
                  </td>
                </tr>
              ) : weekdayWeekend.map((item) => (
                <tr key={item.day_type} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-cyan-400 font-bold">{item.day_type || 'Not available'}</td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {formatCount(item.number_of_days)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-100 font-bold">
                    {formatCount(item.total_trips)}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-300 font-bold">
                    {formatCount(item.average_trips_per_day)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Provider-level and shared-ride metrics (market share, fares, driver pay, speed, and ride type) are not available in the current backend response.
        </p>
      </ChartCard>
    </div>
  );
};

export default TravelBehaviour;
