import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Failed to load analytical partition',
  message = 'There was an error communicating with the data pipeline. You can retry the operation or review offline cached metrics.',
  onRetry
}) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-xl bg-rose-500/5 border border-rose-500/20">
      <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Analytical Query
        </button>
      )}
    </div>
  );
};

export default ErrorState;
