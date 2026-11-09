import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  unit = '',
  trend,
  trendType = 'neutral', // 'up' | 'down' | 'neutral'
  subtitle,
  icon: Icon,
  accentColor = 'cyan', // 'cyan' | 'blue' | 'indigo' | 'emerald' | 'purple' | 'amber'
  tooltip,
  sparkline
}) => {
  const accentStyles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.25)]',
      valueColor: 'text-slate-50',
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.25)]',
      valueColor: 'text-slate-50',
    },
    indigo: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)]',
      valueColor: 'text-slate-50',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]',
      valueColor: 'text-slate-50',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.25)]',
      valueColor: 'text-slate-50',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
      glow: 'group-hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]',
      valueColor: 'text-slate-50',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.cyan;

  const getTrendBadge = () => {
    if (!trend) return null;
    const isPositive = trend.startsWith('+') || trendType === 'up';
    const isNegative = trend.startsWith('-') || trendType === 'down';

    return (
      <div
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : isNegative
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : 'bg-slate-800 text-slate-400 border border-slate-700'
        }`}
      >
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        <span>{trend}</span>
      </div>
    );
  };

  return (
    <div
      className={`group relative rounded-xl bg-[#111827]/80 backdrop-blur-md p-5 border transition-all duration-300 hover:-translate-y-0.5 ${style.border} ${style.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {title}
          </span>
          {tooltip && (
            <div className="relative group/tip" title={tooltip}>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-help" />
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg transition-colors ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.valueColor}`}>
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        {subtitle && <span>{subtitle}</span>}
        {getTrendBadge()}
      </div>

      {sparkline && (
        <div className="mt-3 pt-2 border-t border-slate-800/60">
          {sparkline}
        </div>
      )}
    </div>
  );
};

export default KPICard;
