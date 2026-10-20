import React, { useEffect, useRef } from 'react';
import { X, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { exportTelemetryJson, importTelemetryJson, clearAllTelemetryData } from '../lib/telemetry';
import { useI18n } from '../lib/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus tombol tutup saat modal dibuka
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Simple Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const json = await exportTelemetryJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `openrouter-lens-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(t.settings.exportFailed + err);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = await importTelemetryJson(content);
        if (success) {
          alert(t.settings.importSuccess);
          onDataChanged();
          onClose();
        } else {
          alert(t.settings.importInvalid);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    const confirm = window.confirm(t.settings.clearConfirm);
    if (confirm) {
      await clearAllTelemetryData();
      onDataChanged();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-6 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <h2 id="modal-title" className="text-base font-bold text-slate-900 dark:text-white">
            {t.settings.title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label={t.common.close}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition focus-ring"
            title={`${t.common.close} (Esc)`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              {t.settings.backupSection}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              {t.settings.backupDesc}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-300 dark:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 font-semibold transition focus-ring"
              >
                <Download className="w-4 h-4 text-grape dark:text-volt" aria-hidden="true" />
                <span>{t.settings.exportJson}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-300 dark:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 font-semibold transition focus-ring"
              >
                <Upload className="w-4 h-4 text-grape dark:text-volt" aria-hidden="true" />
                <span>{t.settings.importJson}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                aria-label={t.settings.fileInputAria}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>{t.settings.dangerZone}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              {t.settings.dangerDesc}
            </p>
            <button
              onClick={handleClearAll}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 font-semibold transition border border-red-500/20 focus-ring"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>{t.settings.clearAllBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
