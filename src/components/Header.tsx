import React from 'react';
import { RefreshCw, Sun, Moon, Settings, LogOut, ArrowUpDown } from 'lucide-react';
import { formatRupiah, formatRelativeTime } from '../lib/format';
import { OpenRouterLensGlyph } from './BrandLogo';

interface HeaderProps {
  keyLabel: string;
  fxRate: number;
  fxUpdatedAt: string | null;
  lastSyncTime: string | null;
  isSyncing: boolean;
  isUpdatingFx: boolean;
  theme: 'light' | 'dark';
  onSync: () => void;
  onRefreshFx: () => void;
  onOpenSettings: () => void;
  onDisconnect: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  keyLabel,
  fxRate,
  fxUpdatedAt,
  lastSyncTime,
  isSyncing,
  isUpdatingFx,
  theme,
  onSync,
  onRefreshFx,
  onOpenSettings,
  onDisconnect,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-obsidian/80 border-b border-slate-200 dark:border-white/[0.08] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 flex items-center justify-center text-grape dark:text-volt shrink-0">
            <OpenRouterLensGlyph className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight truncate">OpenRouter Lens</span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {keyLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Sync: {formatRelativeTime(lastSyncTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interactive FX Rate Button */}
          <button
            onClick={onRefreshFx}
            disabled={isUpdatingFx}
            aria-label={`Kurs USD ke IDR: 1 dollar sama dengan ${formatRupiah(fxRate)}. Terakhir diperbarui ${formatRelativeTime(fxUpdatedAt)}. Klik untuk memperbarui kurs.`}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.15] text-xs font-mono text-slate-700 dark:text-slate-200 transition active:scale-95 group cursor-pointer focus-ring"
            title={`Kurs USD/IDR diperbarui: ${formatRelativeTime(fxUpdatedAt)} (Frankfurter API). Klik untuk update live.`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            <span>$1 = {formatRupiah(fxRate)}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-sans ml-0.5">
              ({formatRelativeTime(fxUpdatedAt)})
            </span>
            <ArrowUpDown
              className={`w-3 h-3 text-slate-500 group-hover:text-grape dark:group-hover:text-volt transition ml-0.5 ${isUpdatingFx ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
          </button>

          <button
            onClick={onSync}
            disabled={isSyncing}
            aria-label="Sinkronkan data penggunaan dari OpenRouter sekarang"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 disabled:opacity-50 focus-ring"
            title="Sinkronkan data sekarang"
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing ? 'animate-spin text-grape dark:text-volt' : ''}`}
              aria-hidden="true"
            />
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 focus-ring"
            title="Ganti tema (Light / Dark)"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-volt" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Buka pengaturan dan backup data"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 focus-ring"
            title="Pengaturan & Backup Data"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            onClick={onDisconnect}
            aria-label="Putuskan API key dan keluar"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition active:scale-95 focus-ring"
            title="Putuskan Key & Keluar"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
