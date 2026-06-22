"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface LanguageSelectorProps {
  className?: string;
  isMobile?: boolean;
}

export function LanguageSelector({
  className,
  isMobile = false,
}: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-white/5 bg-white/10 p-1",
        isMobile && "mr-2 flex-1 p-0.5",
        className,
      )}
    >
      <Button
        variant={locale === "vi" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setLocale("vi")}
        className={cn(
          "cursor-pointer rounded-md px-3 py-1.5 text-xs font-bold transition-all select-none",
          locale === "vi"
            ? "text-brand-900 bg-white shadow-sm hover:bg-white/90"
            : "text-white/70 hover:bg-white/10 hover:text-white",
          isMobile &&
            "flex-1 py-1 text-center text-[10px] font-bold sm:text-xs",
        )}
        title="Tiếng Việt"
      >
        {isMobile ? "Tiếng Việt" : "VI"}
      </Button>
      <Button
        variant={locale === "en" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setLocale("en")}
        className={cn(
          "cursor-pointer rounded-md px-3 py-1.5 text-xs font-bold transition-all select-none",
          locale === "en"
            ? "text-brand-900 bg-white shadow-sm hover:bg-white/90"
            : "text-white/70 hover:bg-white/10 hover:text-white",
          isMobile &&
            "flex-1 py-1 text-center text-[10px] font-bold sm:text-xs",
        )}
        title="English"
      >
        {isMobile ? "English" : "EN"}
      </Button>
    </div>
  );
}
