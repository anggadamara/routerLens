import { describe, it, expect } from 'vitest';
import { computeSummaryFromActivity, importTelemetryJson, type ActivityRecord } from './telemetry';

describe('telemetry computation engine', () => {
  it('computes remaining balance and currency conversion accurately', () => {
    const records: ActivityRecord[] = [];
    const summary = computeSummaryFromActivity(records, 25.0, 5.0, 'Work Key', 16000);

    expect(summary.remainingBalance).toBe(20.0);
    expect(summary.remainingBalanceIdr).toBe(320000);
    expect(summary.keyLabel).toBe('Work Key');
    expect(summary.dailyTrend).toHaveLength(14);
  });

  it('aggregates model breakdown and ranking from activity records', () => {
    const today = new Date().toISOString().slice(0, 10);
    const records: ActivityRecord[] = [
      {
        id: 'rec-1',
        date: today,
        model: 'anthropic/claude-3.5-sonnet',
        requests: 10,
        usage: 0.15,
        prompt_tokens: 1000,
        completion_tokens: 500,
      },
      {
        id: 'rec-2',
        date: today,
        model: 'deepseek/deepseek-chat',
        requests: 5,
        usage: 0.05,
        prompt_tokens: 2000,
        completion_tokens: 1000,
      },
    ];

    const summary = computeSummaryFromActivity(records, 10.0, 0.2, 'Test', 16000);

    expect(summary.todayUsage).toBeCloseTo(0.2, 5);
    expect(summary.modelBreakdown).toHaveLength(2);
    expect(summary.modelBreakdown[0].model).toBe('anthropic/claude-3.5-sonnet');
    expect(summary.modelBreakdown[0].costUsd).toBe(0.15);
    expect(summary.modelBreakdown[0].percentage).toBe(75);
    expect(summary.modelBreakdown[1].model).toBe('deepseek/deepseek-chat');
    expect(summary.modelBreakdown[1].percentage).toBe(25);
  });

  it('rejects invalid or non-object JSON on import', async () => {
    expect(await importTelemetryJson('')).toBe(false);
    expect(await importTelemetryJson('not a json')).toBe(false);
    expect(await importTelemetryJson('123')).toBe(false);
    expect(await importTelemetryJson('null')).toBe(false);
    expect(await importTelemetryJson('{"unrelated": true}')).toBe(false);
  });
});
