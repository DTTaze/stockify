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
import { useState } from "react";

export default function Header() {
  const location = usePathname();

  const navItems = [
    { path: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/user/watchlist", label: "Watchlist", icon: Star },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-[#2d4a7c] bg-[#1a365d] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-[#d4af37]" />

              <div>
                <div className="text-xl tracking-wide">DRAGON PREDICT</div>

                <div className="text-xs text-blue-200">
                  Investment Intelligence
                </div>
              </div>
            </div>

            <div className="hidden items-center space-x-6 md:flex">
              <button className="relative rounded-lg p-2 transition-colors hover:bg-white/10">
                <Bell className="h-5 w-5" />

                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#d4af37]"></span>
              </button>

              <div className="flex items-center space-x-3 rounded-lg bg-white/10 px-4 py-2">
                <User className="h-5 w-5" />

                <div>
                  <div className="text-sm">User</div>
                  <div className="text-xs text-blue-200">Investor</div>
                </div>
              </div>

              <button
                //   onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />

                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>

            <button
              // onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-white/10 md:hidden"
            >
              {/* {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )} */}
            </button>
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
                      ? "border-[#d4af37] bg-blue-50 text-[#1a365d]"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#1a365d]"
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
        <div className="bg-[#1a365d] p-4 text-white md:hidden">
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
            <button
              // onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
