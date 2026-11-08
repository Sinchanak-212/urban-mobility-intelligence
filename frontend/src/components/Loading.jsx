import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

export const Loading = ({ message = 'Aggregating distributed Spark partition records...' }) => {
  return (
    <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/80">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{message}</h4>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
        Executing PySpark DataFrame transformations and geospatial indexing across HDFS partitions.
      </p>
    </div>
  );
};

export default Loading;
