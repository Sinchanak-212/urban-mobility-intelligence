import React from 'react';
import {
  Menu,
  RotateCw,
  Search,
  Filter,
  Calendar,
  Building,
  Car,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';
import { NYC_BOROUGHS } from '../data/nycGeoData';

export const Navbar = ({ onOpenSidebar }) => {
  const {
    dateRange,
    setDateRange,
    borough,
    setBorough,
    provider,
    setProvider,
    searchQuery,
    setSearchQuery,
    triggerRefresh,
    isRefreshing,
    backendStatus,
    lastUpdated
  } = useAnalytics();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NYC zone, borough, or route..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Global Filters & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Borough Selector */}
        <div className="relative flex items-center">
          <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none hidden sm:block" />
          <select
            value={borough}
            onChange={(e) => setBorough(e.target.value)}
            className="text-xs bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg pl-2 sm:pl-8 pr-7 py-1.5 appearance-none focus:outline-none focus:border-cyan-500/50 hover:border-slate-700 transition-colors cursor-pointer"
          >
            {NYC_BOROUGHS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-500 text-[10px]">▼</div>
        </div>

        {/* Provider Selector */}
        <div className="relative hidden sm:flex items-center">
          <Car className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="text-xs bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg pl-8 pr-7 py-1.5 appearance-none focus:outline-none focus:border-cyan-500/50 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <option value="all">All Providers (HVFHV)</option>
            <option value="HV0003">Uber (HV0003)</option>
            <option value="HV0005">Lyft (HV0005)</option>
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-500 text-[10px]">▼</div>
        </div>

        {/* Date Range Selector */}
        <div className="relative flex items-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none hidden sm:block" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg pl-2 sm:pl-8 pr-7 py-1.5 appearance-none focus:outline-none focus:border-cyan-500/50 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="today">Today (Real-time)</option>
            <option value="q3">Q3 2024 (Baseline)</option>
          </select>
          <div className="absolute right-2 pointer-events-none text-slate-500 text-[10px]">▼</div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={triggerRefresh}
          disabled={isRefreshing}
          title="Refresh analytics data"
          className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
        </button>

        {/* Backend Status Beacon */}
        <div
          title={
            backendStatus.online
              ? 'FastAPI Spark Backend: Connected'
              : 'FastAPI Backend: Offline (Operating on Mock Demonstration Pipeline)'
          }
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="truncate max-w-[110px]">
            {backendStatus.online ? 'Spark Online' : 'Spark Standby'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
