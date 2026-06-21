"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { createContext, useContext, useMemo } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

import { LocaleType } from "../constants/translations";

interface LanguageContextProps {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as LocaleType;
  const tNextIntl = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const contextValue = useMemo(() => {
    return {
      locale,
      setLocale: (newLocale: LocaleType) => {
        router.push(pathname, { locale: newLocale });
      },
      t: (key: string, values?: Record<string, string | number>): string => {
        return tNextIntl(key, values);
      },
    };
  }, [locale, router, pathname, tNextIntl]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
