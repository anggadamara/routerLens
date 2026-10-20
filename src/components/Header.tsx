import React from 'react';
import { RefreshCw, Sun, Moon, Settings, LogOut, ArrowUpDown, Languages } from 'lucide-react';
import { formatRupiah, formatRelativeTime } from '../lib/format';
import { OpenRouterLensGlyph } from './BrandLogo';
import { useI18n } from '../lib/i18n';

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
  const { locale, toggleLocale, t, isId } = useI18n();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-obsidian/80 border-b border-slate-200 dark:border-white/[0.08] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 flex items-center justify-center text-grape dark:text-volt shrink-0">
            <OpenRouterLensGlyph className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight truncate">RouterLens</span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {keyLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Sync: {formatRelativeTime(lastSyncTime, locale)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interactive FX Rate Button - only shown in ID mode */}
          {isId && (
            <button
              onClick={onRefreshFx}
              disabled={isUpdatingFx}
              aria-label={`Kurs USD ke IDR: 1 dollar sama dengan ${formatRupiah(fxRate)}. Terakhir diperbarui ${formatRelativeTime(fxUpdatedAt, locale)}. Klik untuk memperbarui kurs.`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/[0.15] text-xs font-mono text-slate-700 dark:text-slate-200 transition active:scale-95 group cursor-pointer focus-ring"
              title={`Kurs USD/IDR diperbarui: ${formatRelativeTime(fxUpdatedAt, locale)} (Frankfurter API). Klik untuk update live.`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
              <span>$1 = {formatRupiah(fxRate)}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-sans ml-0.5">
                ({formatRelativeTime(fxUpdatedAt, locale)})
              </span>
              <ArrowUpDown
                className={`w-3 h-3 text-slate-500 group-hover:text-grape dark:group-hover:text-volt transition ml-0.5 ${isUpdatingFx ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            aria-label={`${t.common.switchLang} (${locale === 'en' ? 'Bahasa Indonesia' : 'English'})`}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 focus-ring font-mono text-xs font-semibold"
            title={`${t.common.switchLang}: ${locale === 'en' ? 'Bahasa Indonesia' : 'English'}`}
          >
            <Languages className="w-4 h-4 text-grape dark:text-volt" aria-hidden="true" />
            <span className="uppercase text-[11px] font-bold">{locale}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            aria-label={t.common.sync}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 disabled:opacity-50 focus-ring"
            title={t.common.sync}
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing ? 'animate-spin text-grape dark:text-volt' : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.common.themeLight : t.common.themeDark}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 focus-ring"
            title={theme === 'dark' ? t.common.themeLight : t.common.themeDark}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-volt" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label={t.common.settings}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition active:scale-95 focus-ring"
            title={t.common.settings}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Disconnect Button */}
          <button
            onClick={onDisconnect}
            aria-label={t.common.disconnect}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition active:scale-95 focus-ring"
            title={t.common.disconnect}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
