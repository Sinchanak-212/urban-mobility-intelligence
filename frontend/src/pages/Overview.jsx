import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Car,
  Layers,
  ArrowUpRight,
  Flame,
  CheckCircle,
  Cpu,
  BarChart2,
  Calendar,
  Sparkles
} from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Badge from '../components/Badge';
import DailyTrendChart from '../charts/DailyTrendChart';
import mobilityApi from '../services/api';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const Overview = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'monthly'

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    mobilityApi.getOverview({ dateRange, borough, provider })
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
    return <Loading message="Initializing PySpark cluster analytics and aggregating 18.5M trip records..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const { kpis, kpiTrends, dailyTrips, monthlyTrends, topFivePickupZones, insights } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Overview Dashboard
            </h1>
            <Badge variant="primary" size="sm">
              Partition: Oct 2024
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Macro-level performance, volume distributions, and distributed analytics from NYC High Volume For-Hire Vehicle trips.
          </p>
        </div>

        {/* Distributed Processing Tag */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Spark Aggregation: <strong className="text-cyan-400">{kpis.sparkExecutionTimeSec}s</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (6 main KPIs required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Total Trips */}
        <KPICard
          title="Total Trips"
          value={kpis.totalTripsDisplay}
          trend={kpiTrends.trips}
          trendType="up"
          subtitle="Processed HVFHV volume"
          icon={Car}
          accentColor="cyan"
          tooltip="Total valid trip records indexed across the distributed PySpark parquet cluster"
        />

        {/* KPI 2: Average Distance */}
        <KPICard
          title="Avg Trip Distance"
          value={kpis.avgDistance}
          unit="miles"
          trend={kpiTrends.distance}
          trendType="down"
          subtitle="Median: 3.12 miles"
          icon={MapPin}
          accentColor="blue"
          tooltip="Average highway and arterial distance calculated per trip log"
        />

        {/* KPI 3: Average Duration */}
        <KPICard
          title="Avg Trip Duration"
          value={kpis.avgDuration}
          unit="mins"
          trend={kpiTrends.duration}
          trendType="up"
          subtitle="Peak: 27.8 mins"
          icon={Clock}
          accentColor="indigo"
          tooltip="Time elapsed between pickup telematics registration and passenger dropoff"
        />

        {/* KPI 4: Average Passenger Fare */}
        <KPICard
          title="Avg Passenger Fare"
          value={`$${kpis.avgFare.toFixed(2)}`}
          trend={kpiTrends.fare}
          trendType="up"
          subtitle="Base pay: $19.42"
          icon={DollarSign}
          accentColor="emerald"
          tooltip="Total passenger expenditure including base rate, tips, congestion and state surcharges"
        />

        {/* KPI 5: Total Pickup Locations */}
        <KPICard
          title="Pickup Zones"
          value={kpis.totalPickupLocations}
          unit="TLC Zones"
          trend="100% active"
          subtitle="All 5 boroughs"
          icon={Layers}
          accentColor="purple"
          tooltip="Active TLC geographic taxi zone centroids with pickup trip origin records"
        />

        {/* KPI 6: Total Dropoff Locations */}
        <KPICard
          title="Dropoff Zones"
          value={kpis.totalDropoffLocations}
          unit="TLC Zones"
          trend="99.2% active"
          subtitle="2 NJ connector zones"
          icon={ArrowUpRight}
          accentColor="amber"
          tooltip="TLC taxi zones receiving passenger dropoff completions"
        />
      </div>

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily / Monthly Trends Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title={activeTab === 'daily' ? 'Daily Trip Volume & Average Fare' : 'Monthly Historical Trip Trend (Millions)'}
            subtitle={
              activeTab === 'daily'
                ? '30-day temporal trend illustrating weekend surge patterns and fare adjustments'
                : '12-month seasonality trends based on historical TLC archives'
            }
            icon={BarChart2}
            badge={<Badge variant="primary" size="xs">Spark SQL Aggregate</Badge>}
            action={
              <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'daily'
                      ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Daily (30D)
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'monthly'
                      ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly (12M)
                </button>
              </div>
            }
          >
            {activeTab === 'daily' ? (
              <DailyTrendChart data={dailyTrips} />
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-3 shadow-xl text-xs font-mono">
                              <p className="font-bold text-slate-100">{label}</p>
                              <div className="text-cyan-400">Trips: {item.trips} Million</div>
                              <div className="text-emerald-400">Avg Fare: ${item.avgFare.toFixed(2)}</div>
                              <div className="text-slate-400">YoY Growth: {item.growth}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="trips" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                      {monthlyTrends.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.month === 'Oct' ? '#06b6d4' : '#1e293b'}
                          stroke={entry.month === 'Oct' ? '#38bdf8' : '#334155'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Right 1 Col: Top 5 Busiest Pickup Zones */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Top 5 Pickup Zones"
            subtitle="Ranked by total monthly passenger pickups"
            icon={Flame}
            badge={<Badge variant="amber" size="xs">High Density</Badge>}
          >
            <div className="space-y-3">
              {topFivePickupZones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-400 font-bold">
                        #{zone.rank}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 truncate max-w-[160px]">
                          {zone.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">{zone.borough}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-extrabold text-white">{zone.trips}</div>
                      <div className="text-[10px] text-cyan-400">{zone.share} share</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Avg Fare: <strong className="text-emerald-400">{zone.avgFare}</strong></span>
                    <span className="text-emerald-400">{zone.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Analytical Insights Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Recent Big Data Analytical Insights
          </h3>
          <Badge variant="indigo" size="xs">PySpark Cluster Synthesis</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={item.type === 'spark' ? 'emerald' : item.type === 'peak' ? 'rose' : 'primary'} size="xs">
                  {item.badge}
                </Badge>
                <CheckCircle className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
