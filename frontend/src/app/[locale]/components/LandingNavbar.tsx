"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/providers/LanguageProvider";

export function LandingNavbar() {
  const { t } = useLanguage();

  return (
    <nav className="border-border bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="hover:text-accent-500 h-8 w-8" />
            <span className="text-primary text-2xl font-light tracking-wide">
              DRAGON PREDICT
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-foreground/80 hover:text-primary px-6 py-2.5 transition-colors"
            >
              {t("landingNavbar.login")}
            </Link>
            <Link
              href="/register"
              className="from-primary hover:shadow-primary/20 to-brand-700 rounded-lg bg-linear-to-r px-6 py-2.5 text-white transition-all hover:shadow-lg"
            >
              {t("landingNavbar.register")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
