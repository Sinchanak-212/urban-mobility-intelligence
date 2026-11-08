import React, { useState, useEffect } from 'react';
import {
  Clock,
  Navigation,
  Compass,
  DollarSign,
  Car,
  Users,
  Percent,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import DistributionChart from '../charts/DistributionChart';
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

export const TravelBehaviour = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distTab, setDistTab] = useState('distance'); // 'distance' | 'duration' | 'fare'

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    mobilityApi.getBehaviour({ dateRange, borough, provider })
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dateRange, borough, provider, refreshKey]);

  if (isLoading && !data) {
    return <Loading message="Computing travel behaviour distributions and passenger ride modes..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const {
    timePeriods,
    distanceDistribution,
    durationDistribution,
    fareDistribution,
    sharedVsNonShared,
    serviceProviders,
    avgDurationByZone
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Travel Behaviour
            </h1>
            <Badge variant="indigo" size="sm">
              Rider Habits & Distributions
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirical distributions of trip lengths, elapsed travel duration, time-of-day behavioral patterns, and shared ride economics.
          </p>
        </div>
      </div>

      {/* Ride Type & Service Provider Comparative KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Solo / Non-Shared Trips"
          value={`${sharedVsNonShared.nonShared.percentage}%`}
          unit="Market Share"
          trend="Predominant Mode"
          trendType="neutral"
          subtitle="Avg fare: $27.15 &bull; 21.2 min"
          icon={Car}
          accentColor="cyan"
          tooltip="Single-party private rides (UberX / Lyft Standard)"
        />
        <KPICard
          title="Shared / Pool Rides"
          value={`${sharedVsNonShared.shared.percentage}%`}
          unit="Market Share"
          trend="-64% post-pandemic"
          trendType="down"
          subtitle="Avg fare: $17.80 &bull; 27.6 min"
          icon={Users}
          accentColor="purple"
          tooltip="Shared multiple-party rides (Uber Share / Lyft Shared)"
        />
        <KPICard
          title="Uber Share (HV0003)"
          value={`${serviceProviders[0].marketShare}%`}
          unit="13.2M Trips"
          trend="Avg Speed: 11.8 mph"
          trendType="neutral"
          subtitle="Base driver pay: $19.60"
          icon={Navigation}
          accentColor="blue"
          tooltip="Uber Technologies license HV0003 volume and operational metrics"
        />
        <KPICard
          title="Lyft Share (HV0005)"
          value={`${serviceProviders[1].marketShare}%`}
          unit="5.29M Trips"
          trend="Avg Speed: 12.1 mph"
          trendType="neutral"
          subtitle="Base driver pay: $18.95"
          icon={Compass}
          accentColor="emerald"
          tooltip="Lyft Inc. license HV0005 volume and operational metrics"
        />
      </div>

      {/* Time-of-Day Travel Patterns */}
      <ChartCard
        title="Time-of-Day Mobility Patterns"
        subtitle="Comparing trip volume, average travel distance, duration, and speed across diurnal periods"
        icon={Clock}
        badge={<Badge variant="primary" size="xs">Diurnal Breakdown</Badge>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {timePeriods.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">{p.period}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                  {p.percentage}
                </span>
              </div>
              <div className="text-xl font-extrabold text-white font-mono mt-1">
                {(p.trips / 1000000).toFixed(2)}M trips
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Distance:</span>
                  <span className="text-cyan-300 font-semibold">{p.avgDistance} mi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Duration:</span>
                  <span className="text-indigo-300 font-semibold">{p.avgDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Fare:</span>
                  <span className="text-emerald-400 font-semibold">${p.avgFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Speed:</span>
                  <span className="text-amber-300 font-semibold">{p.avgSpeed} mph</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Distribution Histograms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Toggleable Distribution Chart */}
        <div className="lg:col-span-7">
          <ChartCard
            title={
              distTab === 'distance'
                ? 'Trip Distance Distribution (Miles)'
                : distTab === 'duration'
                ? 'Trip Duration Distribution (Minutes)'
                : 'Passenger Fare Distribution (USD)'
            }
            subtitle="Frequency histogram binned from 18.5M raw telemetry events"
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
            {distTab === 'distance' && (
              <DistributionChart
                data={distanceDistribution}
                dataKey="count"
                nameKey="range"
                fillColor="#0ea5e9"
                unit="trips"
                height={280}
              />
            )}
            {distTab === 'duration' && (
              <DistributionChart
                data={durationDistribution}
                dataKey="count"
                nameKey="range"
                fillColor="#6366f1"
                unit="trips"
                height={280}
              />
            )}
            {distTab === 'fare' && (
              <DistributionChart
                data={fareDistribution}
                dataKey="count"
                nameKey="range"
                fillColor="#10b981"
                unit="trips"
                height={280}
              />
            )}
          </ChartCard>
        </div>

        {/* Average Duration by High-Density Hubs */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Trip Duration by Hub Zone"
            subtitle="Comparing average travel minutes across top pickup origins"
            icon={Navigation}
            badge={<Badge variant="amber" size="xs">Congestion Index</Badge>}
          >
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={avgDurationByZone}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="zone"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    width={110}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-2.5 text-xs font-mono">
                            <div className="font-bold text-white">{item.zone}</div>
                            <div className="text-cyan-400">Avg Duration: {item.duration} min</div>
                            <div className="text-slate-400">Avg Distance: {item.distance} mi</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="duration" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                    {avgDurationByZone.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.duration > 30 ? '#06b6d4' : '#1e293b'}
                        stroke={entry.duration > 30 ? '#22d3ee' : '#334155'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Service Provider Comparison Table */}
      <ChartCard
        title="Service Provider Operational Breakdown"
        subtitle="Comparing high-volume for-hire vehicle licensees operating in NYC"
        icon={Car}
        badge={<Badge variant="primary" size="xs">TLC HVFHV Operators</Badge>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4 text-right">Trip Count</th>
                <th className="py-3 px-4 text-right">Market Share</th>
                <th className="py-3 px-4 text-right">Avg Passenger Fare</th>
                <th className="py-3 px-4 text-right">Driver Pay</th>
                <th className="py-3 px-4 text-right">Avg Speed</th>
                <th className="py-3 px-4 text-right">Shared Ride Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {serviceProviders.map((sp) => (
                <tr key={sp.licenseNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-cyan-400 font-bold">{sp.licenseNumber}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-200">{sp.provider}</td>
                  <td className="py-3 px-4 text-right text-slate-100 font-bold">{sp.trips.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-cyan-300 font-bold">{sp.marketShare}%</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">${sp.avgFare.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">${sp.avgDriverPay.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-amber-300">{sp.avgSpeed} mph</td>
                  <td className="py-3 px-4 text-right text-purple-300">{sp.sharedRideRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default TravelBehaviour;
