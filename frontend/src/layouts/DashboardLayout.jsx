import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAnalytics } from '../context/AnalyticsContext';
import { Info, Sparkles } from 'lucide-react';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { dateRange, borough, provider, backendStatus, lastUpdated } = useAnalytics();

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Global Demo Status Banner */}
        <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-indigo-950/40 border-b border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium text-slate-200">
                Urban Mobility Intelligence &bull; Large-Scale TLC HVFHV Trip Records
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-400 text-[11px] font-mono">
                Active Filter: <span className="text-cyan-400">{borough === 'all' ? 'All NYC Boroughs' : borough}</span> &bull; Provider: <span className="text-blue-400">{provider === 'all' ? 'All HVFHV' : provider}</span> &bull; Window: <span className="text-indigo-300">{dateRange}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="hidden md:inline">Last Spark Sync: {lastUpdated}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/80 text-[10px]">
                Demo Mode Active
              </span>
            </div>
          </div>
        </div>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#0a0e17]/90 px-6 py-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-300">Urban Mobility Intelligence</span> &bull; Big Data Analytics Framework
              <p className="text-[11px] text-slate-400">
                Distributed High-Volume For-Hire Vehicle Analytics powered by Apache Spark, PySpark & HDFS
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 text-center sm:text-right">
              <div>Source: NYC Taxi & Limousine Commission</div>
              <div className="text-cyan-400">FastAPI REST Integration Ready</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
