export type Locale = 'en' | 'id';

export interface Translations {
  common: {
    sync: string;
    syncing: string;
    disconnect: string;
    settings: string;
    themeLight: string;
    themeDark: string;
    close: string;
    or: string;
    switchLang: string;
  };
  connect: {
    title: string;
    subtitle: string;
    apiKeyLabel: string;
    placeholder: string;
    verifying: string;
    connectBtn: string;
    demoBtn: string;
    privacyTitle: string;
    privacyDesc: string;
    doubtsTitle: string;
    doubtsDesc: string;
    showKey: string;
    hideKey: string;
  };
  hero: {
    remainingBalance: string;
    runwayEstimator: string;
    runwayDays: (days: number) => string;
    runwayStable: string;
    runwayCalculatedFrom: (dailyAvg: string) => string;
    todaySpend: string;
    dailyAverage: (avg: string) => string;
  };
  trend: {
    title: string;
    peak: (amount: string) => string;
    top: string;
    ariaBar: (date: string, usd: string, idr?: string, topModel?: string) => string;
  };
  models: {
    title: string;
    count: (count: number) => string;
    emptyTitle: string;
    emptyDesc: string;
    totalSpendPct: (pct: number) => string;
    prompt: string;
    completion: string;
    spendPercentageAria: (model: string, pct: number) => string;
  };
  settings: {
    title: string;
    backupSection: string;
    backupDesc: string;
    exportJson: string;
    importJson: string;
    fileInputAria: string;
    dangerZone: string;
    dangerDesc: string;
    clearAllBtn: string;
    clearConfirm: string;
    importSuccess: string;
    importInvalid: string;
    exportFailed: string;
  };
  banners: {
    demoActiveTitle: string;
    demoActiveDesc: string;
    demoConnectBtn: string;
    gatewayLoading: string;
    dismiss: string;
    syncFailed: string;
  };
  starPrompt: {
    title: string;
    desc: string;
    starBtn: string;
    laterBtn: string;
    closeAria: string;
  };
}
