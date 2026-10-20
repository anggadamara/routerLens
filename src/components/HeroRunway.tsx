import React from 'react';
import { Wallet, Flame, CalendarClock, TrendingUp } from 'lucide-react';
import { formatUsd, formatRupiah } from '../lib/format';

interface HeroRunwayProps {
  remainingBalance: number;
  remainingBalanceIdr: number;
  runwayDays: number | null;
  todayUsage: number;
  todayUsageIdr: number;
  p7DailyAverage: number;
}

export const HeroRunway: React.FC<HeroRunwayProps> = ({
  remainingBalance,
  remainingBalanceIdr,
  runwayDays,
  todayUsage,
  todayUsageIdr,
  p7DailyAverage,
}) => {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-5 sm:p-7 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
        {/* Kolom 1: Sisa Saldo (Hero) */}
        <div className="space-y-1.5 md:border-r border-slate-100 dark:border-white/[0.06] md:pr-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Wallet className="w-4 h-4 text-grape dark:text-volt" />
            <span>Sisa Saldo Akun</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white tabular-nums">
            {formatUsd(remainingBalance)}
          </div>
          <div className="text-sm font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            ≈ {formatRupiah(remainingBalanceIdr)}
          </div>
        </div>

        {/* Kolom 2: Runway Estimator */}
        <div className="space-y-2 md:border-r border-slate-100 dark:border-white/[0.06] md:pr-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CalendarClock className="w-4 h-4 text-emerald-500" />
            <span>Estimasi Runway Saldo</span>
          </div>
          <div>
            {runwayDays !== null ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                <span>Cukup untuk ~{runwayDays} hari</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 text-sm font-medium">
                <span>Konsumsi sangat minim / stabil</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Dihitung dari rata-rata pengeluaran 7 hari terakhir ({formatUsd(p7DailyAverage)}/hari).
          </p>
        </div>

        {/* Kolom 3: Burn-Rate Hari Ini */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Pengeluaran Hari Ini</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatUsd(todayUsage)}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>{formatRupiah(todayUsageIdr)}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              <span>Rata-rata: {formatUsd(p7DailyAverage)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
