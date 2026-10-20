import React, { useState, useEffect } from 'react';
import { Star, X, ExternalLink } from 'lucide-react';
import { useI18n } from '../lib/i18n';

const GITHUB_REPO_URL = 'https://github.com/anggadamara/routerLens';
const STORAGE_KEY = 'or_lens_github_star_status';

interface StarPromptProps {
  isVisibleTrigger: boolean;
}

export const StarPrompt: React.FC<StarPromptProps> = ({ isVisibleTrigger }) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isVisibleTrigger) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'starred' || stored === 'dismissed') {
        return;
      }
    } catch {
      // ignore storage error
    }

    // Delay 3 seconds after data arrives to prevent jarring the user
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisibleTrigger]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleStarClick = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'starred');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-labelledby="star-prompt-heading"
      aria-describedby="star-prompt-desc"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.12] rounded-2xl shadow-xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-3 duration-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-4 h-4 fill-amber-500/30" aria-hidden="true" />
          </div>
          <h2 id="star-prompt-heading" className="text-sm font-bold text-slate-900 dark:text-white">
            {t.starPrompt.title}
          </h2>
        </div>
        <button
          onClick={handleDismiss}
          aria-label={t.starPrompt.closeAria}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition focus-ring -mr-1 -mt-1"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <p id="star-prompt-desc" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {t.starPrompt.desc}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleStarClick}
          className="flex-1 px-3.5 py-2 rounded-xl bg-grape hover:bg-grape-hover text-white dark:bg-volt dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm focus-ring"
        >
          <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>{t.starPrompt.starBtn}</span>
          <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" aria-hidden="true" />
        </a>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium text-xs transition active:scale-95 focus-ring shrink-0"
        >
          {t.starPrompt.laterBtn}
        </button>
      </div>
    </aside>
  );
};
