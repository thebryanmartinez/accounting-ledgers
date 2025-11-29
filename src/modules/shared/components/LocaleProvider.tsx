"use client";

import { createContext, useContext } from "react";
import { NextIntlClientProvider } from 'next-intl';
import en from '@/dictionaries/en.json';
import es from '@/dictionaries/es.json';
import { useLocalStorage } from '@/modules/shared/hooks';

const messages = { en, es };

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleValue] = useLocalStorage("locale", "es");

  const setLocale = (newLocale: string) => {
    setLocaleValue(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
