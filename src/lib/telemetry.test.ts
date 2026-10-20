import { describe, it, expect } from 'vitest';
import { computeSummaryFromGenerations, type GenerationRecord } from './telemetry';

describe('telemetry computation engine', () => {
  it('computes remaining balance and currency conversion accurately', () => {
    const generations: GenerationRecord[] = [];
    const summary = computeSummaryFromGenerations(generations, 25.0, 5.0, 'Work Key', 16000);

    expect(summary.remainingBalance).toBe(20.0);
    expect(summary.remainingBalanceIdr).toBe(320000);
    expect(summary.keyLabel).toBe('Work Key');
    expect(summary.dailyTrend).toHaveLength(14);
  });

  it('aggregates model breakdown and ranking', () => {
    const today = new Date().toISOString();
    const generations: GenerationRecord[] = [
      {
        id: 'gen-1',
        created_at: today,
        model: 'anthropic/claude-3.5-sonnet',
        total_cost: 0.15,
        tokens_prompt: 1000,
        tokens_completion: 500,
      },
      {
        id: 'gen-2',
        created_at: today,
        model: 'deepseek/deepseek-chat',
        total_cost: 0.05,
        tokens_prompt: 2000,
        tokens_completion: 1000,
      },
    ];

    const summary = computeSummaryFromGenerations(generations, 10.0, 0.2, 'Test', 16000);

    expect(summary.todayUsage).toBeCloseTo(0.2, 5);
    expect(summary.modelBreakdown).toHaveLength(2);
    expect(summary.modelBreakdown[0].model).toBe('anthropic/claude-3.5-sonnet');
    expect(summary.modelBreakdown[0].costUsd).toBe(0.15);
    expect(summary.modelBreakdown[0].percentage).toBe(75);
    expect(summary.modelBreakdown[1].model).toBe('deepseek/deepseek-chat');
    expect(summary.modelBreakdown[1].percentage).toBe(25);
  });
});
