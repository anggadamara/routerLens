import React, { useEffect, useRef } from 'react';
import { X, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { exportTelemetryJson, importTelemetryJson, clearAllTelemetryData } from '../lib/telemetry';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
      alert('Gagal export data: ' + err);
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
          alert('Data backup berhasil di-restore!');
          onDataChanged();
          onClose();
        } else {
          alert('Format file JSON tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    const confirm = window.confirm(
      'Yakin ingin menghapus seluruh API key dan data riwayat lokal di browser ini? Aksi ini tidak dapat dibatalkan.'
    );
    if (confirm) {
      await clearAllTelemetryData();
      onDataChanged();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-white/[0.08] p-6 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Pengaturan & Backup Data</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Backup Riwayat Lokal</h3>
            <p className="text-slate-500 mb-3">
              Export data penggunaan dan cache ke file JSON lokal agar bisa dipindahkan ke perangkat lain.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.03] text-slate-700 dark:text-slate-200 font-semibold transition"
              >
                <Download className="w-4 h-4 text-grape dark:text-volt" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.03] text-slate-700 dark:text-slate-200 font-semibold transition"
              >
                <Upload className="w-4 h-4 text-grape dark:text-volt" />
                <span>Import JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Zona Berbahaya</span>
            </h3>
            <p className="text-slate-500 mb-3">
              Menghapus API key, cache sesi, dan seluruh database IndexedDB dari browser ini.
            </p>
            <button
              onClick={handleClearAll}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold transition border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua Data & Putuskan Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
