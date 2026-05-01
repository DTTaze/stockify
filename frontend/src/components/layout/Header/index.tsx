"use client";

import {
  Activity,
  Bell,
  Cpu,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Star,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ButtonCustom } from "@/components/common/form/button";
import { HeaderSkeleton } from "@/components/layout/Header/HeaderSkeleton";
import { ROLE_NAME } from "@/constants/auth";
import { useIsAuthenticated } from "@/hooks/common/useIsAuthenticated";
import { useLogout } from "@/hooks/common/useLogout";
import {
  initialDataProfile,
  useQueryProfile,
} from "@/queries/users/QueryHooksUser";

export default function Header() {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    data: profile = initialDataProfile,
    isError,
    isFetching,
  } = useQueryProfile(isAuthenticated);

  if (isError) {
    handleLogout();
    toast.error("Unable to get user information, please log in again!");
  }

  const config = useMemo(() => {
    if (profile.roles.includes(ROLE_NAME.ADMIN)) {
      return {
        logo: (
          <div className="bg-accent-500 rounded-lg p-2.5">
            <Shield className="text-brand-900 h-7 w-7" />
          </div>
        ),
        title: "ADMIN PANEL",
        subtitle: "System Management",
        badgeLabel: "Administrator",
        username: profile.username || "Admin",
        navItems: [
          {
            path: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            path: "/admin/users",
            label: "Quản lý User",
            icon: Users,
          },
          {
            path: "/admin/data",
            label: "Quản lý Dữ liệu",
            icon: Database,
          },
          {
            path: "/admin/models",
            label: "Quản lý Model",
            icon: Cpu,
          },
          {
            path: "/admin/monitoring",
            label: "Theo dõi Hệ thống",
            icon: Activity,
          },
        ],
        showNotification: false,
      };
    }

    return {
      logo: <TrendingUp className="hover:text-accent-500 h-8 w-8" />,
      title: "DRAGON PREDICT",
      subtitle: "Investment Intelligence",
      badgeLabel: "Investor",
      username: profile.username,
      navItems: [
        {
          path: "/user/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          path: "/user/watchlist",
          label: "Watchlist",
          icon: Star,
        },
      ],
      showNotification: true,
    };
  }, [profile]);

  if (isFetching || isAuthenticated === undefined) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <header className="border-brand-700 bg-brand-900 border-b text-white">
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
                <span className="text-sm">Đăng xuất</span>
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

      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {config.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 border-b-2 px-6 py-4 whitespace-nowrap transition-all ${
                    isActive
                      ? "border-accent-500 text-brand-900 bg-blue-50"
                      : "hover:text-brand-900 border-transparent text-gray-600 hover:bg-gray-50"
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
        <div className="bg-brand-900 p-4 text-white md:hidden">
          <div className="space-y-2">
            {config.navItems.map((item) => {
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
              <span>Đăng xuất</span>
            </ButtonCustom>
          </div>
        </div>
      )}
    </>
  );
}
