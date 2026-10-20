import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { validateAndSaveApiKey } from '../lib/telemetry';
import { OpenRouterLensGlyph } from './BrandLogo';

interface ConnectModalProps {
  onConnected: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ onConnected }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    const res = await validateAndSaveApiKey(apiKey);
    setIsLoading(false);

    if (res.valid) {
      onConnected();
    } else {
      setErrorMessage(res.error || 'Verifikasi API key gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-cloud dark:bg-obsidian text-slate-900 dark:text-cloud flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 flex items-center justify-center mb-3 text-grape dark:text-volt">
            <OpenRouterLensGlyph className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">OpenRouter Usage Lens</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Monitor saldo, runway estimasi, dan konsumsi model secara privat langsung dari browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                autoFocus
                required
                className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-grape font-mono transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                tabIndex={-1}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1.5 animate-in fade-in">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-grape hover:bg-grape-hover active:bg-grape text-white text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-grape/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Key...</span>
              </>
            ) : (
              <>
                <span>Hubungkan Key</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Client-side. Key tersimpan eksklusif di localStorage browser kamu. Zero telemetry.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span>Belum punya key? <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-grape dark:text-volt hover:underline">Buka openrouter.ai/keys</a></span>
          </div>
        </div>
      </div>
    </div>
  );
};
