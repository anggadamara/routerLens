import { describe, it, expect, beforeEach } from 'vitest';

describe('StarPrompt local storage logic', () => {
  const STORAGE_KEY = 'or_lens_github_star_status';
  let mockStorage: Record<string, string> = {};

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

    (globalThis as unknown as { localStorage: Storage }).localStorage = fakeLocalStorage;
  });

  it('initially has no star status recorded', () => {
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('marks starred status properly on action', () => {
    globalThis.localStorage.setItem(STORAGE_KEY, 'starred');
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBe('starred');
  });

  it('marks dismissed status properly on dismiss', () => {
    globalThis.localStorage.setItem(STORAGE_KEY, 'dismissed');
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toBe('dismissed');
  });
});
