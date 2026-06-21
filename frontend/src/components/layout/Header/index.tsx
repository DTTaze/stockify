"use client";

import { Bell, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ButtonCustom } from "@/components/common/form/button";
import { HeaderSkeleton } from "@/components/layout/Header/HeaderSkeleton";
import { ROLE_NAME } from "@/constants/auth";
import { useIsAuthenticated } from "@/hooks/common/useIsAuthenticated";
import { useLogout } from "@/hooks/common/useLogout";
import { Link, usePathname } from "@/i18n/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  initialDataProfile,
  useQueryProfile,
} from "@/queries/users/QueryHooksUser";

import { type NavItem, useHeaderConfig } from "./useHeaderConfig";

export default function Header() {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  const {
    data: profile = initialDataProfile,
    isError,
    isFetching,
  } = useQueryProfile(isAuthenticated);

  if (isError) {
    handleLogout();
    toast.error("Unable to get user information, please log in again!");
  }

  const config = useHeaderConfig(profile, t);

  if (isFetching || isAuthenticated === undefined) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <header className="border-brand-700 bg-brand-900 border-b text-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              {config.logo}

              <div>
                <div className="text-xl tracking-wide">{config.title}</div>
                <div className="text-xs text-blue-200">{config.subtitle}</div>
              </div>
            </div>

            <div className="hidden items-center space-x-6 md:flex">
              {/* Language Selector */}
              <ButtonCustom
                onClick={toggleLanguage}
                className="flex cursor-pointer items-center space-x-1 rounded-lg bg-white/10 px-3 py-2 font-mono text-xs font-bold text-white uppercase select-none hover:bg-white/20"
                title={
                  locale === "vi"
                    ? "Switch to English"
                    : "Chuyển sang Tiếng Việt"
                }
              >
                <span>{locale === "vi" ? "EN" : "VI"}</span>
              </ButtonCustom>

              {/* Theme Toggle */}
              <ButtonCustom
                onClick={toggleTheme}
                className="cursor-pointer rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </ButtonCustom>

              {config.showNotification && (
                <ButtonCustom className="relative rounded-lg p-2 hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                  <span className="bg-accent-500 absolute top-1 right-1 h-2 w-2 rounded-full" />
                </ButtonCustom>
              )}

              <div className="flex items-center space-x-3 rounded-lg bg-white/10 px-4 py-2">
                {profile.roles.includes(ROLE_NAME.ADMIN) ? (
                  <div className="bg-accent-500 text-brand-900 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                    A
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}

                <div>
                  <div className="text-sm">{config.username}</div>
                  <div className="text-xs text-blue-200">
                    {config.badgeLabel}
                  </div>
                </div>
              </div>

              <ButtonCustom
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{t("logout")}</span>
              </ButtonCustom>
            </div>

            <ButtonCustom
              className="rounded-lg p-2 hover:bg-white/10 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </ButtonCustom>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {config.navItems.map((item: NavItem) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 border-b-2 px-6 py-4 whitespace-nowrap transition-all ${
                    isActive
                      ? "border-accent-500 text-brand-900 dark:text-accent-400 bg-blue-50 dark:bg-neutral-950/40"
                      : "hover:text-brand-900 border-transparent text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="bg-brand-900 p-4 text-white md:hidden dark:bg-neutral-950">
          <div className="border-brand-800 mb-4 flex items-center justify-between border-b pb-4 dark:border-neutral-800">
            <ButtonCustom
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white uppercase hover:bg-white/20"
            >
              <span>
                {locale === "vi" ? "Language: English" : "Ngôn ngữ: Tiếng Việt"}
              </span>
            </ButtonCustom>
            <ButtonCustom
              onClick={toggleTheme}
              className="flex items-center space-x-2 rounded-lg bg-white/10 px-3 py-1.5 text-white"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="text-xs">
                {isDark ? "Light Theme" : "Dark Theme"}
              </span>
            </ButtonCustom>
          </div>
          <div className="space-y-2">
            {config.navItems.map((item: NavItem) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-4 py-3 hover:bg-white/10"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <ButtonCustom
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
              <span>{t("logout")}</span>
            </ButtonCustom>
          </div>
        </div>
      )}
    </>
  );
}
