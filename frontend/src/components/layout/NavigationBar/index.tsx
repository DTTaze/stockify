import { LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  const navItems = [
    { path: "/client", label: "Dashboard", icon: LayoutDashboard },
    { path: "/client/watchlist", label: "Watchlist", icon: Star },
  ];
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                // className={`flex items-center space-x-2 border-b-2 px-6 py-4 transition-all ${
                //   isActive
                //     ? "border-[#d4af37] bg-blue-50 text-[#1a365d]"
                //     : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#1a365d]"
                // }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
