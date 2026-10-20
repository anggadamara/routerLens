import { useState, useEffect, useCallback } from 'react';
import {
  getSavedApiKey,
  getStoredTelemetry,
  syncTelemetry,
  clearAllTelemetryData,
  getMockTelemetrySummary,
  type TelemetrySummary,
} from './lib/telemetry';
import { I18nProvider, useI18n } from './lib/i18n';
import { ConnectModal } from './components/ConnectModal';
import { Header } from './components/Header';
import { HeroRunway } from './components/HeroRunway';
import { TrendChart } from './components/TrendChart';
import { ModelList } from './components/ModelList';
import { SettingsModal } from './components/SettingsModal';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';

function LensDashboard() {
  const { t } = useI18n();
  const [apiKey, setApiKey] = useState<string | null>(getSavedApiKey());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [summary, setSummary] = useState<TelemetrySummary | null>(getStoredTelemetry());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isUpdatingFx, setIsUpdatingFx] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('or_lens_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('or_lens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSync = useCallback(async (forceFreshFx = false) => {
    if (isDemoMode) {
      setIsSyncing(true);
      setTimeout(() => {
        setSummary(getMockTelemetrySummary());
        setIsSyncing(false);
      }, 400);
      return;
    }

    if (!apiKey) return;
    setIsSyncing(true);
    setErrorBanner(null);

    try {
      const data = await syncTelemetry(forceFreshFx);
      setSummary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.banners.syncFailed;
      setErrorBanner(message);
    } finally {
      setIsSyncing(false);
    }
  }, [apiKey, isDemoMode, t.banners.syncFailed]);

  const handleRefreshFx = async () => {
    setIsUpdatingFx(true);
    try {
      await handleSync(true);
    } finally {
      setIsUpdatingFx(false);
    }
  };

  useEffect(() => {
    if (apiKey && !summary && !isDemoMode) {
      handleSync();
    }
  }, [apiKey, summary, isDemoMode, handleSync]);

  const handleConnected = () => {
    setIsDemoMode(false);
    const key = getSavedApiKey();
    setApiKey(key);
    handleSync();
  };

  const handleEnterDemo = () => {
    setIsDemoMode(true);
    setSummary(getMockTelemetrySummary());
  };

  const handleExitDemo = () => {
    setIsDemoMode(false);
    setSummary(null);
  };

  const handleDisconnect = async () => {
    if (isDemoMode) {
      handleExitDemo();
      return;
    }
    await clearAllTelemetryData();
    setApiKey(null);
    setSummary(null);
  };

  if (!apiKey && !isDemoMode) {
    return <ConnectModal onConnected={handleConnected} onTryDemo={handleEnterDemo} />;
  }

  return (
    <div className="min-h-screen bg-cloud dark:bg-obsidian text-slate-900 dark:text-cloud transition-colors pb-16">
      <Header
        keyLabel={summary?.keyLabel || 'Personal Key'}
        fxRate={summary?.fxRate || 16500}
        fxUpdatedAt={summary?.fxUpdatedAt || null}
        lastSyncTime={summary?.lastSyncTime || null}
        isSyncing={isSyncing}
        isUpdatingFx={isUpdatingFx}
        theme={theme}
        onSync={() => handleSync(false)}
        onRefreshFx={handleRefreshFx}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onDisconnect={handleDisconnect}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 text-grape dark:text-volt text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in" role="status">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                <strong>{t.banners.demoActiveTitle}</strong> {t.banners.demoActiveDesc}
              </span>
            </div>
            <button
              onClick={handleExitDemo}
              className="px-3.5 py-1.5 rounded-lg bg-grape hover:bg-grape-hover text-white dark:bg-volt dark:text-slate-900 font-semibold text-xs transition active:scale-95 shadow-sm shrink-0 self-start sm:self-auto focus-ring"
            >
              {t.banners.demoConnectBtn}
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorBanner && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center justify-between gap-3 animate-in fade-in" role="alert">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-xs font-semibold hover:underline focus-ring rounded px-1.5 py-0.5"
            >
              {t.banners.dismiss}
            </button>
          </div>
        )}

        {/* Loading overlay for initial sync */}
        {isSyncing && !summary && (
          <div className="py-20 text-center space-y-3" role="status" aria-live="polite">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-grape dark:text-volt" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t.banners.gatewayLoading}
            </p>
          </div>
        )}

        {/* Active Dashboard */}
        {summary && (
          <>
            <HeroRunway
              remainingBalance={summary.remainingBalance}
              remainingBalanceIdr={summary.remainingBalanceIdr}
              runwayDays={summary.runwayDays}
              todayUsage={summary.todayUsage}
              todayUsageIdr={summary.todayUsageIdr}
              p7DailyAverage={summary.p7DailyAverage}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendChart dailyTrend={summary.dailyTrend} />
              <ModelList models={summary.modelBreakdown} />
            </div>
          </>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={() => {
          setSummary(getStoredTelemetry());
          setApiKey(getSavedApiKey());
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <LensDashboard />
    </I18nProvider>
  );
}
