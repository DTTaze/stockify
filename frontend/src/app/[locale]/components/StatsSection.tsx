"use client";

import { useLanguage } from "@/providers/LanguageProvider";

export function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="from-brand-900 to-brand-950 dark:from-brand-950 relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br p-12 lg:p-16 dark:to-neutral-950">
          <div className="absolute inset-0 opacity-10">
            <div className="bg-accent-500 absolute top-0 left-0 h-64 w-64 rounded-full blur-3xl"></div>
            <div className="bg-accent-500 absolute right-0 bottom-0 h-64 w-64 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              {t("stats.title")}
            </h2>
            <p className="text-brand-100/90 mx-auto mb-12 max-w-2xl text-xl">
              {t("stats.subtitle")}
            </p>

            <div className="grid gap-8 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="text-accent-400 hover:text-accent-300 mb-2 text-4xl font-bold">
                  10,000+
                </div>
                <div className="text-brand-100/90">
                  {t("stats.activeUsers")}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="text-accent-400 hover:text-accent-300 mb-2 text-4xl font-bold">
                  1M+
                </div>
                <div className="text-brand-100/90">
                  {t("stats.successfulPredicts")}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="text-accent-400 hover:text-accent-300 mb-2 text-4xl font-bold">
                  500+
                </div>
                <div className="text-brand-100/90">{t("stats.stockCodes")}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="text-accent-400 hover:text-accent-300 mb-2 text-4xl font-bold">
                  99.8%
                </div>
                <div className="text-brand-100/90">{t("stats.accuracy")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
