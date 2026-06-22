"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { HeaderSkeleton } from "@/components/layout/Header/HeaderSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ROLE_NAME } from "@/constants/auth";
import { useIsAuthenticated } from "@/hooks/common/useIsAuthenticated";
import { useLogout } from "@/hooks/common/useLogout";
import { Link, usePathname } from "@/i18n/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  initialDataProfile,
  useQueryProfile,
} from "@/queries/users/QueryHooksUser";

import { LanguageSelector } from "./LanguageSelector";
import { MobileMenu } from "./MobileMenu";
import NotificationDropdown, {
  type NotificationItem,
} from "./NotificationDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { type NavItem, useHeaderConfig } from "./useHeaderConfig";

export default function Header() {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Initialize notifications on mount or when locale changes
  useEffect(() => {
    setNotifications([
      {
        id: "1",
        titleKey: "notifications.fptSuccess",
        time: locale === "vi" ? "5 phút trước" : "5 mins ago",
        read: false,
        type: "success",
      },
      {
        id: "2",
        titleKey: "notifications.vcbRise",
        time: locale === "vi" ? "1 giờ trước" : "1 hour ago",
        read: false,
        type: "info",
      },
      {
        id: "3",
        titleKey: "notifications.hoseAlert",
        time: locale === "vi" ? "2 giờ trước" : "2 hours ago",
        read: true,
        type: "warning",
      },
      {
        id: "4",
        titleKey: "notifications.vn30Update",
        time: locale === "vi" ? "1 ngày trước" : "1 day ago",
        read: true,
        type: "success",
      },
    ]);
  }, [locale]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
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
              <LanguageSelector />
              <ThemeToggle />

              {config.showNotification && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  onMarkAllRead={handleMarkAllRead}
                  onClearAll={handleClearAll}
                />
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
                  <Badge
                    variant="outline"
                    className="border-blue-200/30 px-1 py-0 text-xs text-blue-200 select-none"
                  >
                    {config.badgeLabel}
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex cursor-pointer items-center space-x-2 rounded-lg border-transparent bg-white/10 px-4 py-2 text-white hover:border-transparent hover:bg-white/20 hover:text-white active:translate-y-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{t("logout")}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              className="cursor-pointer rounded-lg p-2 text-white hover:bg-white/10 hover:text-white active:translate-y-0 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
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
        <MobileMenu
          navItems={config.navItems}
          onLogout={handleLogout}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
