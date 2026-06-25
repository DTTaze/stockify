"use client";

import { TrendingUp } from "lucide-react";

import { useLanguage } from "@/providers/LanguageProvider";

export function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-950 border-brand-900 border-t px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-3 md:mb-0">
            <TrendingUp className="text-accent-500 hover:text-accent-400 h-8 w-8" />
            <span className="text-2xl font-light text-white">
              DRAGON PREDICT
            </span>
          </div>
          <div className="text-brand-200/80 text-sm">{t("footer.rights")}</div>
        </div>
      </div>
    </footer>
  );
}
