import { get, set, clear } from 'idb-keyval';

export interface GenerationRecord {
  id: string;
  created_at: string;
  model: string;
  total_cost: number;
  tokens_prompt: number;
  tokens_completion: number;
  latency?: number;
}

export interface TelemetrySummary {
  keyLabel: string;
  totalCredits: number;
  totalUsage: number;
  remainingBalance: number;
  remainingBalanceIdr: number;
  runwayDays: number | null;
  todayUsage: number;
  todayUsageIdr: number;
  p7DailyAverage: number;
  fxRate: number;
  lastSyncTime: string | null;
  dailyTrend: Array<{
    date: string;
    costUsd: number;
    costIdr: number;
    topModel: string;
  }>;
  modelBreakdown: Array<{
    model: string;
    costUsd: number;
    costIdr: number;
    promptTokens: number;
    completionTokens: number;
    percentage: number;
  }>;
}

const STORAGE_KEY_AUTH = 'or_lens_key';
const STORAGE_KEY_LABEL = 'or_lens_label';
const STORAGE_KEY_SUMMARY = 'or_lens_summary';
const STORAGE_KEY_FX = 'or_lens_fx';
const IDB_KEY_GENERATIONS = 'or_lens_generations';
const DEFAULT_FX_RATE = 16500;

export function getSavedApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_AUTH);
  } catch {
    return null;
  }
}

export async function validateAndSaveApiKey(key: string): Promise<{ valid: boolean; label?: string; error?: string }> {
  const cleanKey = key.trim();
  if (!cleanKey) return { valid: false, error: 'API key tidak boleh kosong.' };

  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { Authorization: `Bearer ${cleanKey}` },
    });

    if (!res.ok) {
      if (res.status === 401) return { valid: false, error: 'API key tidak valid atau dicabut.' };
      return { valid: false, error: `Verifikasi gagal (${res.status}).` };
    }

    const data = await res.json();
    const label = data?.data?.label || 'Personal Key';

    localStorage.setItem(STORAGE_KEY_AUTH, cleanKey);
    localStorage.setItem(STORAGE_KEY_LABEL, label);
    return { valid: true, label };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Koneksi gagal';
    return { valid: false, error: message };
  }
}

export async function clearAllTelemetryData(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_LABEL);
    localStorage.removeItem(STORAGE_KEY_SUMMARY);
    await clear();
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}

export async function getExchangeRate(): Promise<number> {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_FX);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.rate > 0) {
        return parsed.rate;
      }
    }
  } catch {
    // ignore parse error and fetch fresh
  }

  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=IDR');
    if (res.ok) {
      const data = await res.json();
      const rate = data?.rates?.IDR || DEFAULT_FX_RATE;
      localStorage.setItem(STORAGE_KEY_FX, JSON.stringify({ rate, timestamp: Date.now() }));
      return rate;
    }
  } catch {
    // fallback
  }

  return DEFAULT_FX_RATE;
}

export function computeSummaryFromGenerations(
  generations: GenerationRecord[],
  totalCredits: number,
  totalUsage: number,
  keyLabel: string,
  fxRate: number
): TelemetrySummary {
  const remainingBalance = Math.max(0, totalCredits - totalUsage);
  const remainingBalanceIdr = remainingBalance * fxRate;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let todayUsage = 0;
  let p7Usage = 0;

  const dayBuckets: Record<string, { costUsd: number; models: Record<string, number> }> = {};
  const modelStats: Record<string, { costUsd: number; promptTokens: number; completionTokens: number }> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().slice(0, 10);
    dayBuckets[dateKey] = { costUsd: 0, models: {} };
  }

  for (const gen of generations) {
    const genDate = gen.created_at ? gen.created_at.slice(0, 10) : '';
    const cost = gen.total_cost || 0;
    const model = gen.model || 'unknown';

    if (genDate === todayStr) {
      todayUsage += cost;
    }

    if (new Date(gen.created_at) >= sevenDaysAgo) {
      p7Usage += cost;
    }

    if (dayBuckets[genDate]) {
      dayBuckets[genDate].costUsd += cost;
      dayBuckets[genDate].models[model] = (dayBuckets[genDate].models[model] || 0) + cost;
    }

    if (!modelStats[model]) {
      modelStats[model] = { costUsd: 0, promptTokens: 0, completionTokens: 0 };
    }
    modelStats[model].costUsd += cost;
    modelStats[model].promptTokens += gen.tokens_prompt || 0;
    modelStats[model].completionTokens += gen.tokens_completion || 0;
  }

  const p7DailyAverage = p7Usage / 7;
  const runwayDays = p7DailyAverage > 0 ? Math.round(remainingBalance / p7DailyAverage) : null;

  const dailyTrend = Object.entries(dayBuckets).map(([date, val]) => {
    let topModel = '-';
    let maxModelCost = 0;
    for (const [m, c] of Object.entries(val.models)) {
      if (c > maxModelCost) {
        maxModelCost = c;
        topModel = m;
      }
    }
    return {
      date,
      costUsd: val.costUsd,
      costIdr: val.costUsd * fxRate,
      topModel,
    };
  });

  const totalGenCost = Object.values(modelStats).reduce((acc, m) => acc + m.costUsd, 0) || 1;
  const modelBreakdown = Object.entries(modelStats)
    .map(([model, stat]) => ({
      model,
      costUsd: stat.costUsd,
      costIdr: stat.costUsd * fxRate,
      promptTokens: stat.promptTokens,
      completionTokens: stat.completionTokens,
      percentage: Math.round(((stat.costUsd / totalGenCost) * 100) * 10) / 10,
    }))
    .sort((a, b) => b.costUsd - a.costUsd);

  return {
    keyLabel,
    totalCredits,
    totalUsage,
    remainingBalance,
    remainingBalanceIdr,
    runwayDays,
    todayUsage,
    todayUsageIdr: todayUsage * fxRate,
    p7DailyAverage,
    fxRate,
    lastSyncTime: new Date().toISOString(),
    dailyTrend,
    modelBreakdown,
  };
}

export async function syncTelemetry(): Promise<TelemetrySummary> {
  const apiKey = getSavedApiKey();
  if (!apiKey) throw new Error('API key belum diatur.');

  const fxRate = await getExchangeRate();
  const keyLabel = localStorage.getItem(STORAGE_KEY_LABEL) || 'Personal Key';

  const creditsRes = await fetch('https://openrouter.ai/api/v1/credits', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!creditsRes.ok) {
    if (creditsRes.status === 401) throw new Error('API key tidak valid atau telah dicabut (401).');
    throw new Error(`Gagal mengambil data credits (${creditsRes.status}).`);
  }

  const creditsJson = await creditsRes.json();
  const totalCredits = creditsJson?.data?.total_credits ?? 0;
  const totalUsage = creditsJson?.data?.total_usage ?? 0;

  const existingGenerations: GenerationRecord[] = (await get(IDB_KEY_GENERATIONS)) || [];
  const existingIds = new Set(existingGenerations.map((g) => g.id));

  try {
    const genRes = await fetch('https://openrouter.ai/api/v1/generation?limit=100', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (genRes.ok) {
      const genJson = await genRes.json();
      const rawList = Array.isArray(genJson?.data) ? genJson.data : [];

      const newRecords: GenerationRecord[] = [];
      for (const item of rawList) {
        if (item?.id && !existingIds.has(item.id)) {
          newRecords.push({
            id: item.id,
            created_at: item.created_at || new Date().toISOString(),
            model: item.model || 'unknown',
            total_cost: item.total_cost || 0,
            tokens_prompt: item.tokens_prompt || 0,
            tokens_completion: item.tokens_completion || 0,
            latency: item.latency,
          });
          existingIds.add(item.id);
        }
      }

      if (newRecords.length > 0) {
        existingGenerations.push(...newRecords);
        await set(IDB_KEY_GENERATIONS, existingGenerations);
      }
    }
  } catch (err) {
    console.warn('Gagal fetch generations terbaru, menggunakan data lokal:', err);
  }

  const summary = computeSummaryFromGenerations(
    existingGenerations,
    totalCredits,
    totalUsage,
    keyLabel,
    fxRate
  );

  localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(summary));
  return summary;
}

export function getStoredTelemetry(): TelemetrySummary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUMMARY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function exportTelemetryJson(): Promise<string> {
  const generations: GenerationRecord[] = (await get(IDB_KEY_GENERATIONS)) || [];
  const summary = getStoredTelemetry();
  return JSON.stringify({
    version: '1.0',
    exported_at: new Date().toISOString(),
    summary,
    generations,
  }, null, 2);
}

export async function importTelemetryJson(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.generations)) return false;

    const existing: GenerationRecord[] = (await get(IDB_KEY_GENERATIONS)) || [];
    const idSet = new Set(existing.map((g) => g.id));

    for (const item of parsed.generations) {
      if (item?.id && !idSet.has(item.id)) {
        existing.push(item);
        idSet.add(item.id);
      }
    }

    await set(IDB_KEY_GENERATIONS, existing);
    if (parsed.summary) {
      localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(parsed.summary));
    }
    return true;
  } catch {
    return false;
  }
}
