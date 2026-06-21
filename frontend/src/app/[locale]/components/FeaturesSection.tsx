"use client";

import {
  Activity,
  BarChart3,
  LineChart,
  Shield,
  Target,
  Zap,
} from "lucide-react";

import { useLanguage } from "@/providers/LanguageProvider";

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="from-primary to-brand-700 relative overflow-hidden bg-linear-to-br px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-10">
        <div className="bg-accent-500 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl"></div>
        <div className="bg-accent-500 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl text-white">{t("features.title")}</h2>
          <p className="mx-auto max-w-2xl text-xl text-blue-100">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <BarChart3 className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.candlestickTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.candlestickDesc")}
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <LineChart className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.aiPredictTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.aiPredictDesc")}
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Activity className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.indicatorsTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.indicatorsDesc")}
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Target className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.watchlistTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.watchlistDesc")}
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Shield className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.securityTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.securityDesc")}
            </p>
          </div>

          <div className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15">
            <div className="bg-accent-500 mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Zap className="text-primary h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl text-white">
              {t("features.fastTitle")}
            </h3>
            <p className="leading-relaxed text-blue-100">
              {t("features.fastDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
