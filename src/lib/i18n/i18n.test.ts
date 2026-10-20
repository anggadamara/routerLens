import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { idTranslations } from './id';
import { enTranslations } from './en';
import { detectDefaultLocale } from './index';

describe('i18n translations parity', () => {
  function getObjectKeysDeep(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.keys(obj).flatMap((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        return getObjectKeysDeep(val as Record<string, unknown>, fullKey);
      }
      return [fullKey];
    });
  }

  it('id and en dictionaries should have identical key structures', () => {
    const idKeys = getObjectKeysDeep(idTranslations as unknown as Record<string, unknown>).sort();
    const enKeys = getObjectKeysDeep(enTranslations as unknown as Record<string, unknown>).sort();

    expect(idKeys).toEqual(enKeys);
  });

  it('should interpolate functions correctly in both id and en', () => {
    expect(idTranslations.hero.runwayDays(5)).toBe('Cukup untuk ~5 hari');
    expect(enTranslations.hero.runwayDays(5)).toBe('Good for ~5 days');

    expect(idTranslations.trend.ariaBar('2026-10-20', '$1.25', 'Rp 20.000', 'claude-3-5-sonnet')).toContain('Tanggal 2026-10-20');
    expect(enTranslations.trend.ariaBar('2026-10-20', '$1.25', undefined, 'claude-3-5-sonnet')).toContain('Date 2026-10-20, spend $1.25');
    // Ensure English ariaBar doesn't mention IDR when not passed
    expect(enTranslations.trend.ariaBar('2026-10-20', '$1.25')).not.toContain('Rp');
  });
});

describe('detectDefaultLocale', () => {
  let mockStorage: Record<string, string> = {};
  const originalWindow = globalThis.window;
  const originalLang = globalThis.navigator?.language;

  beforeEach(() => {
    mockStorage = {};
    const fakeLocalStorage: Storage = {
      get length() {
        return Object.keys(mockStorage).length;
      },
      clear: () => {
        mockStorage = {};
      },
      getItem: (key: string) => mockStorage[key] ?? null,
      key: (index: number) => Object.keys(mockStorage)[index] ?? null,
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
    };

    (globalThis as unknown as { window: unknown }).window = {
      localStorage: fakeLocalStorage,
    };
    (globalThis as unknown as { localStorage: Storage }).localStorage = fakeLocalStorage;

    if (globalThis.navigator) {
      Object.defineProperty(globalThis.navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });
    }
  });

  afterEach(() => {
    (globalThis as unknown as { window: unknown }).window = originalWindow;
    delete (globalThis as unknown as { localStorage?: Storage }).localStorage;

    if (globalThis.navigator && originalLang !== undefined) {
      Object.defineProperty(globalThis.navigator, 'language', {
        value: originalLang,
        configurable: true,
      });
    }
  });

  it('returns stored locale from localStorage if valid', () => {
    globalThis.localStorage.setItem('or_lens_locale', 'en');
    expect(detectDefaultLocale()).toBe('en');

    globalThis.localStorage.setItem('or_lens_locale', 'id');
    expect(detectDefaultLocale()).toBe('id');
  });

  it('detects id from navigator.language when no stored preference exists', () => {
    Object.defineProperty(globalThis.navigator, 'language', {
      value: 'id-ID',
      configurable: true,
    });
    expect(detectDefaultLocale()).toBe('id');
  });

  it('falls back to en when navigator language is english or other languages', () => {
    Object.defineProperty(globalThis.navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });
    expect(detectDefaultLocale()).toBe('en');

    Object.defineProperty(globalThis.navigator, 'language', {
      value: 'ja-JP',
      configurable: true,
    });
    expect(detectDefaultLocale()).toBe('en');
  });
});
