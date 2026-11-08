import React from 'react';
import { Maximize2, Info } from 'lucide-react';

export const ChartCard = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  children,
  className = '',
  infoTooltip,
  isLoading = false
}) => {
  return (
    <div
      className={`rounded-xl bg-[#111827]/90 backdrop-blur-md border border-slate-800/80 p-5 shadow-card transition-all duration-200 hover:border-slate-700/80 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2">
              {title}
              {badge}
            </h3>
            {infoTooltip && (
              <span title={infoTooltip} className="cursor-help text-slate-500 hover:text-slate-300">
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            {action}
          </div>
        )}
      </div>

      <div className="relative w-full">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-xs text-slate-400 animate-pulse">Processing distributed metrics...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
