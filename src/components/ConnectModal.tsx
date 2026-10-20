import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Key, Sparkles, Languages } from 'lucide-react';
import { validateAndSaveApiKey } from '../lib/telemetry';
import { OpenRouterLensGlyph } from './BrandLogo';
import { useI18n } from '../lib/i18n';

interface ConnectModalProps {
  onConnected: () => void;
  onTryDemo: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ onConnected, onTryDemo }) => {
  const { locale, toggleLocale, t } = useI18n();
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
      setErrorMessage(res.error || (locale === 'en' ? 'API key verification failed.' : 'Verifikasi API key gagal.'));
    }
  };

  return (
    <div className="min-h-screen bg-cloud dark:bg-obsidian text-slate-900 dark:text-cloud flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-xl relative">
        {/* Language switch button */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={`${t.common.switchLang} (${locale === 'en' ? 'Bahasa Indonesia' : 'English'})`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.15] transition active:scale-95 focus-ring font-mono text-xs font-semibold"
            title={`${t.common.switchLang}: ${locale === 'en' ? 'Bahasa Indonesia' : 'English'}`}
          >
            <Languages className="w-3.5 h-3.5 text-grape dark:text-volt" aria-hidden="true" />
            <span className="uppercase text-[11px] font-bold">{locale}</span>
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-grape/10 dark:bg-volt/10 border border-grape/25 dark:border-volt/25 flex items-center justify-center mb-3 text-grape dark:text-volt">
            <OpenRouterLensGlyph className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t.connect.title}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs">
            {t.connect.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5" htmlFor="api-key-input">
              {t.connect.apiKeyLabel}
            </label>
            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.connect.placeholder}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                required
                className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] text-slate-900 dark:text-white text-sm focus-ring font-mono transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? t.connect.hideKey : t.connect.showKey}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition p-1.5 rounded-lg focus-ring"
              >
                {showKey ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1.5 animate-in fade-in" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !apiKey.trim()}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-grape hover:bg-grape-hover active:bg-grape text-white text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-grape/25 focus-ring"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{t.connect.verifying}</span>
              </>
            ) : (
              <>
                <span>{t.connect.connectBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-white/[0.08] w-full" aria-hidden="true" />
          <span className="bg-white dark:bg-panel-dark px-2 text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold absolute">
            {t.common.or}
          </span>
        </div>

        <button
          type="button"
          onClick={onTryDemo}
          className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-300 dark:border-white/[0.1] bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-semibold transition active:scale-[0.98] focus-ring"
        >
          <Sparkles className="w-3.5 h-3.5 text-grape dark:text-volt" aria-hidden="true" />
          <span>{t.connect.demoBtn}</span>
        </button>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
          <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>{t.connect.privacyTitle}</strong> {t.connect.privacyDesc}
            </span>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <Key className="w-4 h-4 text-grape dark:text-volt shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>{t.connect.doubtsTitle}</strong> {t.connect.doubtsDesc}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
