import { describe, it, expect } from 'vitest';
import { formatUsd, formatRupiah, formatTokens, formatRelativeTime } from './format';

describe('format utilities', () => {
  it('formats USD with 4 decimals when small, 2 decimals when >= 1', () => {
    expect(formatUsd(0.0042)).toBe('$0.0042');
    expect(formatUsd(12.5)).toBe('$12.50');
    expect(formatUsd(0)).toBe('$0.00');
  });

  it('formats Rupiah correctly', () => {
    expect(formatRupiah(16500)).toMatch(/Rp\s*16\.500/);
    expect(formatRupiah(0)).toMatch(/Rp\s*0/);
  });

  it('formats token counts with K and M suffixes', () => {
    expect(formatTokens(850)).toBe('850');
    expect(formatTokens(12500)).toBe('12.5K');
    expect(formatTokens(3400000)).toBe('3.4M');
  });

  it('formats relative time safely', () => {
    expect(formatRelativeTime(null)).toBe('-');
    expect(formatRelativeTime('invalid-date')).toBe('-');
    expect(formatRelativeTime(new Date().toISOString())).toBe('Baru saja');
  });
});
