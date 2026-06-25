"use client";

import { ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/providers/LanguageProvider";

const MOCK_VN_INDEX_HEIGHTS = [
  { id: "h1", value: 40 },
  { id: "h2", value: 60 },
  { id: "h3", value: 45 },
  { id: "h4", value: 70 },
  { id: "h5", value: 55 },
  { id: "h6", value: 80 },
  { id: "h7", value: 65 },
  { id: "h8", value: 85 },
  { id: "h9", value: 70 },
  { id: "h10", value: 90 },
  { id: "h11", value: 75 },
  { id: "h12", value: 95 },
];

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="border-accent-500/20 bg-accent-500/10 hover:text-accent-500 mb-6 inline-flex items-center space-x-2 rounded-full border px-4 py-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">{t("hero.aiTech")}</span>
            </div>

            <h1 className="text-foreground mb-6 text-5xl leading-tight font-bold lg:text-6xl">
              {t("hero.title1")}
              <br />
              <span className="text-primary hover:text-accent-500 transition-colors">
                {t("hero.title2")}
              </span>
            </h1>

            <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
              {t("hero.desc")}
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="from-primary hover:shadow-primary/30 group to-brand-700 inline-flex items-center justify-center rounded-lg bg-linear-to-r px-8 py-4 text-white transition-all hover:shadow-xl"
              >
                {t("hero.startNow")}
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="border-primary text-primary hover:bg-primary inline-flex items-center justify-center rounded-lg border-2 px-8 py-4 transition-all hover:text-white"
              >
                {t("hero.exploreMore")}
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-primary mb-1 text-3xl font-bold">10K+</div>
                <div className="text-muted-foreground text-sm">
                  {t("hero.users")}
                </div>
              </div>
              <div className="bg-border h-12 w-px"></div>
              <div>
                <div className="text-primary mb-1 text-3xl font-bold">
                  99.8%
                </div>
                <div className="text-muted-foreground text-sm">
                  {t("hero.accuracy")}
                </div>
              </div>
              <div className="bg-border h-12 w-px"></div>
              <div>
                <div className="text-primary mb-1 text-3xl font-bold">24/7</div>
                <div className="text-muted-foreground text-sm">
                  {t("hero.active")}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="to-primary/20 from-accent-500/20 absolute inset-0 rounded-3xl bg-linear-to-br blur-3xl"></div>
            <div className="border-border bg-card text-card-foreground relative rounded-2xl border p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-muted-foreground font-semibold">
                  VN-INDEX
                </h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  +2.5%
                </span>
              </div>

              <div className="mb-6">
                <div className="text-foreground mb-2 text-4xl font-bold">
                  1,254.32
                </div>
                <div className="text-sm text-green-600">
                  +31.25 {t("hero.pointsToday")}
                </div>
              </div>

              <div className="relative flex h-48 items-end justify-between gap-2">
                {MOCK_VN_INDEX_HEIGHTS.map((item) => (
                  <div
                    key={item.id}
                    className="from-brand-900 to-accent-500 flex-1 rounded-t bg-linear-to-t"
                    style={{ height: `${item.value}%` }}
                  ></div>
                ))}
              </div>

              <div className="border-border mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("hero.highest")}
                  </div>
                  <div className="text-foreground">1,268.45</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("hero.lowest")}
                  </div>
                  <div className="text-foreground">1,242.18</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 text-xs">
                    {t("hero.volume")}
                  </div>
                  <div className="text-foreground">850M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
