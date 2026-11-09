import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Activity,
  SlidersHorizontal,
  Flame,
  Info,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import AnomalySpikeChart from '../charts/AnomalySpikeChart';
import mobilityApi from '../services/api';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AnomalyDetection = () => {
  const { dateRange, borough, provider, refreshKey } = useAnalytics();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table filters & search
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [tableSearch, setTableSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    mobilityApi.getAnomalies({ dateRange, borough, provider })
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

  // Filter records
  const filteredRecords = useMemo(() => {
    if (!data?.records) return [];
    return data.records.filter((rec) => {
      const matchesCategory = categoryFilter === 'all' || rec.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || rec.severity === severityFilter;
      const matchesSearch =
        tableSearch === '' ||
        rec.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.pickupZone.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.dropoffZone.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.reason.toLowerCase().includes(tableSearch.toLowerCase());
      return matchesCategory && matchesSeverity && matchesSearch;
    });
  }, [data, categoryFilter, severityFilter, tableSearch]);

  if (isLoading && !data) {
    return <Loading message="Executing PySpark Isolation Forest and IQR boundary anomaly diagnostics..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const { summary, categories, zoneSpikes } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Anomaly Detection
            </h1>
            <Badge variant="rose" size="sm">
              PySpark IQR & Isolation Forest
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Distributed identification of unusual travel patterns, telematics outliers, extreme fares, and spatial-temporal surges.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          Filter Method: <span className="text-cyan-400">Spark IQR + Isolation Forest 3.2</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Flagged Anomalies"
          value={summary.totalAnomalies.toLocaleString()}
          unit="Records"
          trend={summary.anomalyRate}
          trendType="neutral"
          subtitle="Out of 18,492,840 records"
          icon={AlertTriangle}
          accentColor="cyan"
          tooltip="Total statistically irregular records isolated from the baseline distribution"
        />
        <KPICard
          title="Trip-Level Anomalies"
          value={summary.tripLevelAnomalies.toLocaleString()}
          unit="Single Trips"
          trend="84.7% of total"
          trendType="neutral"
          subtitle="Extreme duration, fare, speed"
          icon={Activity}
          accentColor="amber"
          tooltip="Individual trip logs with sensor errors or extreme duration/fare discrepancies"
        />
        <KPICard
          title="Demand-Level Anomalies"
          value={summary.demandLevelAnomalies.toLocaleString()}
          unit="Cluster Surges"
          trend="15.3% of total"
          trendType="neutral"
          subtitle="Event surges & transit outages"
          icon={Flame}
          accentColor="emerald"
          tooltip="Spatial clusters experiencing demand spikes beyond 3.0 standard deviations"
        />
        <KPICard
          title="Flagged Fare Value"
          value={summary.flaggedValueAmount}
          trend="Audit Queue"
          trendType="down"
          subtitle="Under secondary verification"
          icon={DollarSign}
          accentColor="purple"
          tooltip="Total monetary value associated with irregular fare or zero-fare records"
        />
      </div>

      {/* Anomaly Category Distribution & Zone Spikes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (Pie / Donut + List) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Anomaly Category Distribution"
            subtitle="Categorized by the primary PySpark statistical trigger"
            icon={ShieldAlert}
            badge={<Badge variant="primary" size="xs">5 Diagnostic Classes</Badge>}
          >
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#111827"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-[#0d1322] border border-slate-700 p-2.5 text-xs font-mono">
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-cyan-400">Count: {item.count} ({item.percentage}%)</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <div className="font-mono text-slate-100 font-bold">
                    {cat.count} <span className="text-slate-500 font-normal">({cat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Localized Demand Spikes by Zone */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Localized Zone Demand Spikes"
            subtitle="Sudden abnormal surges detected in local pickup frequencies (e.g. sports, concerts, transit outages)"
            icon={Flame}
            badge={<Badge variant="rose" size="xs">Demand Surges</Badge>}
          >
            <AnomalySpikeChart data={zoneSpikes} />
          </ChartCard>
        </div>
      </div>

      {/* Filterable Anomaly Record Table */}
      <ChartCard
        title="Detected Anomaly Records Audit Table"
        subtitle="Potentially unusual trip records flagged by distributed IQR and Isolation Forest models for inspection"
        icon={AlertTriangle}
        badge={<Badge variant="primary" size="xs">{filteredRecords.length} Flagged Trips</Badge>}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Anomaly Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search trip ID, zone, reason..."
                className="pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3">Record ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Pickup Zone</th>
                <th className="py-3 px-3">Dropoff Zone</th>
                <th className="py-3 px-3 text-right">Distance</th>
                <th className="py-3 px-3 text-right">Duration</th>
                <th className="py-3 px-3 text-right">Fare</th>
                <th className="py-3 px-3">Anomaly Category</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3">Spark Flag Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-cyan-400 font-bold">{r.id}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">{r.timestamp}</td>
                    <td className="py-3 px-3 font-sans font-medium text-slate-200 whitespace-nowrap">{r.pickupZone}</td>
                    <td className="py-3 px-3 font-sans text-slate-300 whitespace-nowrap">{r.dropoffZone}</td>
                    <td className="py-3 px-3 text-right text-slate-200 font-bold">{r.distanceMi} mi</td>
                    <td className="py-3 px-3 text-right text-indigo-300 font-bold">{r.durationMin} min</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">${r.fare.toFixed(2)}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <Badge
                        variant={
                          r.severity === 'Critical'
                            ? 'critical'
                            : r.severity === 'Moderate'
                            ? 'moderate'
                            : 'low'
                        }
                        size="xs"
                      >
                        {r.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-[11px] max-w-xs truncate" title={r.reason}>
                      {r.reason}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                    No anomaly records match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default AnomalyDetection;
