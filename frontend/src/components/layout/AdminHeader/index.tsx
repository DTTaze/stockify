"use client";

import {
  Activity,
  Cpu,
  Database,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const location = usePathname();
  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Quản lý User", icon: Users },
    { path: "/admin/data", label: "Quản lý Dữ liệu", icon: Database },
    { path: "/admin/models", label: "Quản lý Model", icon: Cpu },
    { path: "/admin/monitoring", label: "Theo dõi Hệ thống", icon: Activity },
  ];
  return (
    <div>
      <header className="bg-gradient-to-r from-[#1a365d] via-[#2d4a7c] to-[#1a365d] text-white shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-[#d4af37] p-2.5">
                <Shield className="h-7 w-7 text-[#1a365d]" />
              </div>
              <div>
                <div className="text-xl tracking-wide">ADMIN PANEL</div>
                <div className="text-xs text-blue-200">System Management</div>
              </div>
            </div>

            <div className="hidden items-center space-x-4 md:flex">
              <div className="flex items-center space-x-3 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37] text-sm text-[#1a365d]">
                  A
                </div>
                <div>
                  {/* <div className="text-sm">{user.name}</div> */}
                  <div className="text-xs text-blue-200">Administrator</div>
                </div>
              </div>

              <button
                // onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>

            <button
              //   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 border-b-2 px-6 py-4 whitespace-nowrap transition-all ${
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
    </div>
  );
}
