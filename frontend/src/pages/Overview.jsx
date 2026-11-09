
import React, { useEffect, useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Route,
  Flame,
  BarChart2,
  Sparkles,
  Cpu
} from 'lucide-react';

import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Badge from '../components/Badge';
import DailyTrendChart from '../charts/DailyTrendChart';
import mobilityApi from '../services/api';
import { useAnalytics } from '../context/AnalyticsContext';

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-US');

export const Overview = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [overview, dailyTrips, zones, behaviour] = await Promise.all([
          mobilityApi.getOverview({ dateRange, borough, provider }),
          mobilityApi.getDemandDaily({ dateRange, borough, provider }),
          mobilityApi.getDemandZones({ dateRange, borough, provider }),
          mobilityApi.getBehaviour({ dateRange, borough, provider })
        ]);

        if (isMounted) {
          setData({
            overview,
            dailyTrips,
            topPickupZones: zones.topPickupZones || [],
            behaviour
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load dashboard analytics.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, [dateRange, borough, provider, refreshKey]);

  if (isLoading && !data) {
    return <Loading message="Loading January 2025 mobility analytics..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!data) return null;

  const { overview, dailyTrips, topPickupZones, behaviour } = data;

  const highestDemandDay = [...dailyTrips].sort(
    (a, b) => b.total_trips - a.total_trips
  )[0];

  const busiestZone = topPickupZones[0];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Overview Dashboard
            </h1>
            <Badge variant="primary" size="sm">
              {overview.period || 'January 2025'}
            </Badge>
          </div>

          <p className="text-sm text-slate-400 mt-1">
            Large-scale mobility analytics from NYC High Volume For-Hire Vehicle trips.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Backend: <strong className="text-emerald-400">Connected</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <KPICard
          title="Total Trips"
          value={formatNumber(overview.total_trips)}
          subtitle="January 2025 trip records"
          icon={Car}
          accentColor="cyan"
          tooltip="Total records in the NYC TLC HVFHV dataset."
        />

        <KPICard
          title="Average Distance"
          value={Number(behaviour.average_distance_miles).toFixed(2)}
          unit="miles"
          subtitle={`Median: ${Number(behaviour.median_distance_miles).toFixed(2)} miles`}
          icon={MapPin}
          accentColor="blue"
        />

        <KPICard
          title="Average Duration"
          value={Number(behaviour.average_duration_minutes).toFixed(2)}
          unit="minutes"
          subtitle={`Median: ${Number(behaviour.median_duration_minutes).toFixed(2)} minutes`}
          icon={Clock}
          accentColor="indigo"
        />

        <KPICard
          title="Valid Trips"
          value={formatNumber(behaviour.valid_trips)}
          subtitle="Records used for travel statistics"
          icon={Route}
          accentColor="emerald"
        />

      </div>

      {/* Daily Demand and Top Pickup Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <ChartCard
            title="Daily Trip Volume"
            subtitle="Trip distribution by day of the week — January 2025"
            icon={BarChart2}
            badge={<Badge variant="primary" size="xs">Spark SQL Analytics</Badge>}
          >
            <DailyTrendChart data={dailyTrips} />
          </ChartCard>
        </div>

        <div className="lg:col-span-1">
          <ChartCard
            title="Top 5 Pickup Zones"
            subtitle="Ranked by total pickups"
            icon={Flame}
            badge={<Badge variant="amber" size="xs">High Demand</Badge>}
          >
            <div className="space-y-3">
              {topPickupZones.slice(0, 5).map((zone, index) => (
                <div
                  key={`${zone.pickup_borough}-${zone.pickup_zone}`}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 shrink-0 rounded-md bg-slate-800 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          {zone.pickup_zone}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {zone.pickup_borough}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-white shrink-0">
                      {formatNumber(zone.total_pickups)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Data-derived Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Dataset Insights
          </h3>
          <Badge variant="indigo" size="xs">January 2025</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {highestDemandDay && (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
              <Badge variant="primary" size="xs">Highest Daily Demand</Badge>
              <h4 className="text-lg font-bold text-white mt-2">
                {highestDemandDay.day_name}
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                {formatNumber(highestDemandDay.total_trips)} trips
              </p>
            </div>
          )}

          {busiestZone && (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
              <Badge variant="amber" size="xs">Busiest Pickup Zone</Badge>
              <h4 className="text-lg font-bold text-white mt-2">
                {busiestZone.pickup_zone}
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                {formatNumber(busiestZone.total_pickups)} pickups · {busiestZone.pickup_borough}
              </p>
            </div>
          )}

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
            <Badge variant="success" size="xs">Average Trip Distance</Badge>
            <h4 className="text-lg font-bold text-white mt-2">
              {Number(behaviour.average_distance_miles).toFixed(2)} miles
            </h4>
            <p className="text-sm text-slate-400 mt-1">
              Median distance: {Number(behaviour.median_distance_miles).toFixed(2)} miles
            </p>
          </div>

        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-400">
          Some dashboard data could not be refreshed: {error}
        </p>
      )}

    </div>
  );
};

export default Overview;
