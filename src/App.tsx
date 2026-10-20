import { useState, useEffect, useCallback } from 'react';
import { getSavedApiKey, getStoredTelemetry, syncTelemetry, clearAllTelemetryData, type TelemetrySummary } from './lib/telemetry';
import { ConnectModal } from './components/ConnectModal';
import { Header } from './components/Header';
import { HeroRunway } from './components/HeroRunway';
import { TrendChart } from './components/TrendChart';
import { ModelList } from './components/ModelList';
import { SettingsModal } from './components/SettingsModal';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(getSavedApiKey());
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
    if (!apiKey) return;
    setIsSyncing(true);
    setErrorBanner(null);

    try {
      const data = await syncTelemetry(forceFreshFx);
      setSummary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal sinkronisasi data';
      setErrorBanner(message);
    } finally {
      setIsSyncing(false);
    }
  }, [apiKey]);

  const handleRefreshFx = async () => {
    setIsUpdatingFx(true);
    try {
      await handleSync(true);
    } finally {
      setIsUpdatingFx(false);
    }
  };

  useEffect(() => {
    if (apiKey && !summary) {
      handleSync();
    }
  }, [apiKey, summary, handleSync]);

  const handleConnected = () => {
    const key = getSavedApiKey();
    setApiKey(key);
    handleSync();
  };

  const handleDisconnect = async () => {
    await clearAllTelemetryData();
    setApiKey(null);
    setSummary(null);
  };

  if (!apiKey) {
    return <ConnectModal onConnected={handleConnected} />;
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
        {/* Error Banner */}
        {errorBanner && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-xs font-semibold hover:underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Loading overlay for initial sync */}
        {isSyncing && !summary && (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-grape dark:text-volt" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Menghubungkan ke OpenRouter Gateway...
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
