"use client";

import {
  Bell,
  LayoutDashboard,
  LogOut,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ButtonCustom } from "@/components/common/form/button";
import { useIsAuthenticated } from "@/hooks/common/useIsAuthenticated";
import { useLogout } from "@/hooks/common/useLogout";
import {
  initialDataProfile,
  useQueryProfile,
} from "@/queries/users/QueryHooksUser";

function HeaderSkeleton() {
  return (
    <>
      <header className="border-brand-700 bg-brand-900 border-b text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 animate-pulse items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-white/20" />

              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-white/20" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>

            <div className="hidden items-center space-x-6 md:flex">
              <div className="h-10 w-10 rounded-lg bg-white/10" />

              <div className="flex items-center space-x-3 rounded-lg bg-white/10 px-4 py-2">
                <div className="h-5 w-5 rounded-full bg-white/20" />

                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-white/20" />
                  <div className="h-3 w-16 rounded bg-white/10" />
                </div>
              </div>

              <div className="h-10 w-28 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex animate-pulse space-x-3 py-3">
            <div className="h-10 w-36 rounded-lg bg-gray-200" />
            <div className="h-10 w-36 rounded-lg bg-gray-200" />
          </div>
        </div>
      </nav>
    </>
  );
}

export default function Header() {
  const location = usePathname();
  const { handleLogout } = useLogout();
  const isAuthenticated = useIsAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    data: profile = initialDataProfile,
    isError,
    isFetching,
  } = useQueryProfile(isAuthenticated);

  useEffect(() => {
    if (!isError) return;

    handleLogout();
    toast.error("Unable to get user information, please log in again!");
  }, [isError, handleLogout]);

  if (isFetching || isAuthenticated === undefined) {
    return <HeaderSkeleton />;
  }

  const navItems = [
    { path: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/user/watchlist", label: "Watchlist", icon: Star },
  ];

  return (
    <>
      <header className="border-brand-700 bg-brand-900 border-b text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrendingUp className="hover:text-accent-500 h-8 w-8" />

              <div>
                <div className="text-xl tracking-wide">DRAGON PREDICT</div>
                <div className="text-xs text-blue-200">
                  Investment Intelligence
                </div>
              </div>
            </div>

            <div className="hidden items-center space-x-6 md:flex">
              <ButtonCustom className="relative rounded-lg p-2 transition-colors hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="bg-accent-500 absolute top-1 right-1 h-2 w-2 rounded-full" />
              </ButtonCustom>

              <div className="flex items-center space-x-3 rounded-lg bg-white/10 px-4 py-2">
                <User className="h-5 w-5" />

                <div>
                  <div className="text-sm">{profile.username}</div>
                  <div className="text-xs text-blue-200">Investor</div>
                </div>
              </div>

              <ButtonCustom
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Đăng xuất</span>
              </ButtonCustom>
            </div>

            <ButtonCustom
              className="rounded-lg p-2 hover:bg-white/10 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ""
            </ButtonCustom>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 border-b-2 px-6 py-4 transition-all ${
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
            {navItems.map((item) => {
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
