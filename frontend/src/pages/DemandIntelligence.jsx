import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  Zap,
  Users
} from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Badge from '../components/Badge';
import HourlyDemandChart from '../charts/HourlyDemandChart';
import BoroughComparisonChart from '../charts/BoroughComparisonChart';
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

export const DemandIntelligence = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();
  const [hourlyData, setHourlyData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [zonesData, setZonesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoneView, setZoneView] = useState('pickup'); // 'pickup' | 'dropoff'

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      mobilityApi.getDemandHourly({ dateRange, borough, provider }),
      mobilityApi.getDemandDaily({ dateRange, borough, provider }),
      mobilityApi.getDemandZones({ dateRange, borough, provider })
    ])
      .then(([hourly, daily, zones]) => {
        if (isMounted) {
          setHourlyData(hourly);
          setDailyData(daily);
          setZonesData(zones);
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

  if (isLoading && (!hourlyData || !dailyData || !zonesData)) {
    return <Loading message="Computing hourly and geospatial demand patterns across Spark partitions..." />;
  }

  if (error && !hourlyData) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const { topPickupZones, topDropoffZones, boroughDemand } = zonesData;
  const activeZoneList = zoneView === 'pickup' ? topPickupZones : topDropoffZones;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Demand Intelligence
            </h1>
            <Badge variant="blue" size="sm">
              Temporal & Spatial Analysis
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Granular analysis of travel demand across hourly cycles, days of the week, NYC boroughs, and top trip hubs.
          </p>
        </div>
      </div>

      {/* Peak Demand Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Morning Peak Hour"
          value="08:00 AM"
          unit="1.36M Trips"
          trend="Weekday Rush"
          trendType="neutral"
          subtitle="Manhattan commuter influx"
          icon={Zap}
          accentColor="cyan"
          tooltip="Maximum concentrated morning pickup volume recorded across business districts"
        />
        <KPICard
          title="Evening Peak Hour"
          value="06:00 PM"
          unit="1.54M Trips"
          trend="Highest Daily Volume"
          trendType="up"
          subtitle="Crosstown & outbound peak"
          icon={Clock}
          accentColor="blue"
          tooltip="Absolute peak transportation demand hour across all five boroughs"
        />
        <KPICard
          title="Busiest Day of Week"
          value="Saturday"
          unit="3.18M Trips"
          trend="+31.8% vs Monday"
          trendType="up"
          subtitle="Nightlife & leisure travel"
          icon={Calendar}
          accentColor="purple"
          tooltip="Saturday generates the highest single-day trip volume across Queens & Brooklyn"
        />
        <KPICard
          title="Weekday vs Weekend"
          value="71.7% / 28.3%"
          unit="Volume Share"
          trend="11.4 vs 14.2 mph"
          trendType="neutral"
          subtitle="Weekend traffic is 24% faster"
          icon={Users}
          accentColor="emerald"
          tooltip="Comparison of total volume and average vehicle speeds between weekdays and weekends"
        />
      </div>

      {/* Hourly Demand Section */}
      <ChartCard
        title="Hourly Transportation Demand (24-Hour Cycle)"
        subtitle="Dual-curve comparison illustrating weekday commuter spikes vs weekend evening recreation shifts"
        icon={Clock}
        badge={<Badge variant="primary" size="xs">00:00 - 23:00</Badge>}
        infoTooltip="PySpark GroupBy hour(pickup_datetime) aggregated across HVFHV trip logs"
      >
        <HourlyDemandChart data={hourlyData} />
      </ChartCard>

      {/* Day of the Week & Borough Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day of the Week Pattern */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Weekly Demand by Day"
            subtitle="Total trips and average passenger fare per weekday"
            icon={Calendar}
            badge={<Badge variant="indigo" size="xs">Mon - Sun</Badge>}
          >
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2d42" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-3 shadow-xl text-xs font-mono">
                            <p className="font-bold text-slate-100 font-sans mb-1">{label}</p>
                            <div className="text-cyan-400">Trips: {item.trips.toLocaleString()}</div>
                            <div className="text-emerald-400">Avg Fare: ${item.avgFare.toFixed(2)}</div>
                            <div className="text-slate-400">Avg Duration: {item.avgDuration} min</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {dailyData.map((d, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={d.day === 'Saturday' || d.day === 'Friday' ? '#06b6d4' : '#1e293b'}
                        stroke={d.day === 'Saturday' || d.day === 'Friday' ? '#38bdf8' : '#334155'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Borough-Wise Demand Breakdown */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Borough-Wise Transportation Demand"
            subtitle="Geographical distribution across Manhattan, Brooklyn, Queens, Bronx and Staten Island"
            icon={Building}
            badge={<Badge variant="primary" size="xs">All 5 Boroughs</Badge>}
          >
            <BoroughComparisonChart data={boroughDemand} />
          </ChartCard>
        </div>
      </div>

      {/* Top 10 Zones (Pickups vs Dropoffs Toggleable Table) */}
      <ChartCard
        title={`Top 10 High-Demand ${zoneView === 'pickup' ? 'Pickup' : 'Drop-off'} Zones`}
        subtitle="Ranked taxi zones categorized by trip volume, market share, and average passenger fare"
        icon={MapPin}
        action={
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setZoneView('pickup')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                zoneView === 'pickup'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top Pickups
            </button>
            <button
              onClick={() => setZoneView('dropoff')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                zoneView === 'dropoff'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top Drop-offs
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Zone ID</th>
                <th className="py-3 px-3">Zone Name</th>
                <th className="py-3 px-3">Borough</th>
                <th className="py-3 px-3 text-right">Trip Count</th>
                <th className="py-3 px-3 text-right">Market Share</th>
                <th className="py-3 px-3 text-right">Avg Passenger Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeZoneList.map((z) => (
                <tr key={z.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="w-5 h-5 rounded bg-slate-800 text-cyan-400 font-bold inline-flex items-center justify-center text-[10px]">
                      {z.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">#{z.id}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{z.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-sans">
                      {z.borough}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-100 font-bold">{z.trips.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-cyan-400 font-medium">{z.share}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">${z.avgFare.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default DemandIntelligence;
