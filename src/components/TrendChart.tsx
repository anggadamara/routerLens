import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { formatUsd, formatRupiah } from '../lib/format';

interface TrendChartProps {
  dailyTrend: Array<{
    date: string;
    costUsd: number;
    costIdr: number;
    topModel: string;
  }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ dailyTrend }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxCost = Math.max(...dailyTrend.map((d) => d.costUsd), 0.01);

  const formatDateLabel = (isoDate: string) => {
    try {
      const parts = isoDate.split('-');
      return `${parts[2]}/${parts[1]}`;
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-grape dark:text-volt" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tren Pengeluaran 14 Hari</h2>
        </div>
        <span className="text-xs text-slate-400">Puncak: {formatUsd(maxCost)}</span>
      </div>

      <div className="relative">
        <div className="flex items-end gap-1.5 sm:gap-2 h-36 pt-6 px-1">
          {dailyTrend.map((item, idx) => {
            const heightPercent = Math.max((item.costUsd / maxCost) * 100, 4);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 z-20 pointer-events-none bg-slate-900 dark:bg-slate-800 text-white rounded-xl p-2.5 shadow-xl text-xs whitespace-nowrap border border-white/10 animate-in fade-in zoom-in-95">
                    <div className="font-semibold text-slate-300">{item.date}</div>
                    <div className="font-mono text-sm font-bold text-volt mt-0.5">
                      {formatUsd(item.costUsd)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {formatRupiah(item.costIdr)}
                    </div>
                    {item.topModel && item.topModel !== '-' && (
                      <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-slate-400">
                        Top: <span className="text-slate-200 font-mono">{item.topModel.split('/')[1] || item.topModel}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 ${
                    isHovered
                      ? 'bg-volt dark:bg-volt shadow-md shadow-volt/20'
                      : item.costUsd > 0
                      ? 'bg-grape/80 dark:bg-grape hover:bg-grape'
                      : 'bg-slate-100 dark:bg-white/[0.04]'
                  }`}
                />

                {/* Date label */}
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate w-full text-center">
                  {formatDateLabel(item.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
