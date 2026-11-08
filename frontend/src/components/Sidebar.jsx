import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Radio,
  Server,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { backendStatus } = useAnalytics();

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/demand',
      label: 'Demand Intelligence',
      icon: BarChart3,
      badge: 'Hourly'
    },
    {
      to: '/geo',
      label: 'Geographic Intelligence',
      icon: MapPin,
      badge: 'NYC Map'
    },
    {
      to: '/behaviour',
      label: 'Travel Behaviour',
      icon: Clock,
      badge: null
    },
    {
      to: '/anomalies',
      label: 'Anomaly Detection',
      icon: AlertTriangle,
      badge: 'Spark-ML'
    },
    {
      to: '/forecast',
      label: 'Demand Forecasting',
      icon: TrendingUp,
      badge: 'GBDT'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d1322] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-glow-cyan text-white font-black">
                <Radio className="w-5 h-5 text-cyan-200" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-100 tracking-tight leading-tight">
                Urban Mobility
              </h1>
              <p className="text-[11px] font-medium text-cyan-400 tracking-wider uppercase">
                Intelligence Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Data Context Tag */}
        <div className="px-5 py-3 bg-[#0a0e17]/60 border-b border-slate-800/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              NYC TLC HVFHV
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px]">
              18.5M Rows
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Analytics Modules
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border hover:border-slate-700/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Distributed Backend Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0e17]/80">
          <div className="rounded-xl p-3 bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                PySpark Engine
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Active
              </span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Cluster:</span>
                <span className="text-slate-300">Hadoop HDFS</span>
              </div>
              <div className="flex justify-between">
                <span>Executors:</span>
                <span className="text-cyan-400">16 (128 Cores)</span>
              </div>
              <div className="flex justify-between">
                <span>FastAPI:</span>
                <span className={backendStatus.online ? 'text-emerald-400' : 'text-amber-400'}>
                  {backendStatus.online ? 'Connected' : 'Mock Fallback'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            Big Data Analytics Final Project &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
