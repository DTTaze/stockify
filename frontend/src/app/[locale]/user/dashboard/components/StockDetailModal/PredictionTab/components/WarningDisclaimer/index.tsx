"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/providers/LanguageProvider";

export function WarningDisclaimer() {
  const { t } = useLanguage();

  return (
    <Card className="dark:border-brand-900/30 flex flex-row items-start gap-0 space-x-3 rounded-xl border border-blue-500/10 bg-blue-50/50 p-4 py-4 dark:bg-blue-500/5">
      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
      <div>
        <p className="text-indigo-655 text-xs font-bold dark:text-indigo-300">
          {t("disclaimerTitle")}
        </p>
        <p className="text-gray-550 dark:text-slate-405 mt-0.5 text-[10px]">
          {t("disclaimerDesc")}
        </p>
      </div>
    </Card>
  );
}
