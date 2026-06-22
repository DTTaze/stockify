"use client";

import { LogOut } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/providers/LanguageProvider";

import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import type { NavItem } from "./useHeaderConfig";

interface MobileMenuProps {
  navItems: NavItem[];
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({ navItems, onLogout, onClose }: MobileMenuProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-900 p-4 text-white md:hidden dark:bg-neutral-950">
      <div className="border-brand-800 mb-4 flex items-center justify-between border-b pb-4 dark:border-neutral-800">
        <LanguageSelector isMobile />
        <ThemeToggle isMobile />
      </div>
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className="flex items-center space-x-3 rounded-lg px-4 py-3 hover:bg-white/10"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center justify-start space-x-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 hover:text-white active:translate-y-0"
        >
          <LogOut className="h-5 w-5" />
          <span>{t("logout")}</span>
        </Button>
      </div>
    </div>
  );
}
