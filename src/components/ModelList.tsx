import React from 'react';
import { Cpu } from 'lucide-react';
import { formatUsd, formatRupiah, formatTokens } from '../lib/format';
import { BrandLogo } from './BrandLogo';
import { useI18n } from '../lib/i18n';

interface ModelBreakdownItem {
  model: string;
  costUsd: number;
  costIdr: number;
  promptTokens: number;
  completionTokens: number;
  percentage: number;
}

interface ModelListProps {
  models: ModelBreakdownItem[];
}

export const ModelList: React.FC<ModelListProps> = ({ models }) => {
  const { t, isId } = useI18n();

  if (models.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-8 text-center text-slate-600 dark:text-slate-400">
        <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.models.emptyTitle}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {t.models.emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-grape dark:text-volt" aria-hidden="true" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.models.title}</h2>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400">{t.models.count(models.length)}</span>
      </div>

      <div className="space-y-3">
        {models.map((item) => {
          const [provider, modelName] = item.model.includes('/')
            ? item.model.split('/')
            : ['', item.model];

          return (
            <div
              key={item.model}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/[0.12] transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-white/[0.06] flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                    <BrandLogo modelName={item.model} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {modelName}
                    </div>
                    {provider && (
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                        {provider}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {formatUsd(item.costUsd)}
                  </div>
                  {isId && (
                    <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                      {formatRupiah(item.costIdr)}
                    </div>
                  )}
                </div>
              </div>

              {/* Accessible Progress bar */}
              <div
                className="w-full bg-slate-200 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden mb-2"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t.models.spendPercentageAria(modelName, item.percentage)}
              >
                <div
                  style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  className="bg-grape dark:bg-volt h-full rounded-full transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <span>{t.models.totalSpendPct(item.percentage)}</span>
                <span className="flex items-center gap-2">
                  <span>{t.models.prompt}: {formatTokens(item.promptTokens)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{t.models.completion}: {formatTokens(item.completionTokens)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
