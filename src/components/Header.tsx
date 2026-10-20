import React from 'react';
import { RefreshCw, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { formatRupiah, formatRelativeTime } from '../lib/format';
import { OpenRouterLensGlyph } from './BrandLogo';

interface HeaderProps {
  keyLabel: string;
  fxRate: number;
  lastSyncTime: string | null;
  isSyncing: boolean;
  theme: 'light' | 'dark';
  onSync: () => void;
  onOpenSettings: () => void;
  onDisconnect: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  keyLabel,
  fxRate,
  lastSyncTime,
  isSyncing,
  theme,
  onSync,
  onOpenSettings,
  onDisconnect,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-obsidian/80 border-b border-slate-200 dark:border-white/[0.08] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 flex items-center justify-center text-grape dark:text-volt shrink-0">
            <OpenRouterLensGlyph className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight truncate">OpenRouter Lens</span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                {keyLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Sync: {formatRelativeTime(lastSyncTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden md:flex items-center px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-xs font-mono text-slate-600 dark:text-slate-300">
            $1 = {formatRupiah(fxRate)}
          </div>

          <button
            onClick={onSync}
            disabled={isSyncing}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 disabled:opacity-50"
            title="Sinkronkan data sekarang"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-grape dark:text-volt' : ''}`} />
          </button>

          <button
            onClick={onToggleTheme}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95"
            title="Ganti tema (Light / Dark)"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-volt" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95"
            title="Pengaturan & Backup Data"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onDisconnect}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition active:scale-95"
            title="Putuskan Key & Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
