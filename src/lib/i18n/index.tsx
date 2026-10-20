import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Locale, Translations } from './types';
import { enTranslations } from './en';
import { idTranslations } from './id';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
  isId: boolean;
}

const STORAGE_KEY_LOCALE = 'or_lens_locale';

export const detectDefaultLocale = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOCALE);
    if (saved === 'en' || saved === 'id') return saved;

    const navLang = navigator.language?.toLowerCase() || '';
    if (navLang.startsWith('id')) return 'id';
    return 'en';
  } catch {
    return 'en';
  }
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(detectDefaultLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY_LOCALE, newLocale);
    } catch {
      // ignore storage error
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'id' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const t = locale === 'id' ? idTranslations : enTranslations;
    return {
      locale,
      setLocale,
      toggleLocale,
      t,
      isId: locale === 'id',
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};

export * from './types';
