import {
  Activity,
  Cpu,
  Database,
  LayoutDashboard,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useMemo } from "react";

import { ROLE_NAME } from "@/constants/auth";

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserProfile {
  username?: string;
  roles: string[];
}

interface HeaderConfig {
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  badgeLabel: string;
  username: string;
  navItems: NavItem[];
  showNotification: boolean;
}

export function useHeaderConfig(
  profile: UserProfile,
  t: (key: string) => string,
): HeaderConfig {
  return useMemo(() => {
    if (profile.roles.includes(ROLE_NAME.ADMIN)) {
      return {
        logo: (
          <div className="bg-accent-500 rounded-lg p-2.5">
            <Shield className="text-brand-900 h-7 w-7" />
          </div>
        ),
        title: t("adminPanel"),
        subtitle: t("systemManagement"),
        badgeLabel: t("adminBadge"),
        username: profile.username || "Admin",
        navItems: [
          {
            path: "/admin/dashboard",
            label: t("dashboard"),
            icon: LayoutDashboard,
          },
          {
            path: "/admin/users",
            label: t("userManagement"),
            icon: Users,
          },
          {
            path: "/admin/data",
            label: t("dataManagement"),
            icon: Database,
          },
          {
            path: "/admin/models",
            label: t("modelManagement"),
            icon: Cpu,
          },
          {
            path: "/admin/monitoring",
            label: t("systemMonitoring"),
            icon: Activity,
          },
        ],
        showNotification: false,
      };
    }

    return {
      logo: <TrendingUp className="hover:text-accent-500 h-8 w-8" />,
      title: t("investorPanel"),
      subtitle: t("investmentIntelligence"),
      badgeLabel: t("investorBadge"),
      username: profile.username || "",
      navItems: [
        {
          path: "/user/dashboard",
          label: t("dashboard"),
          icon: LayoutDashboard,
        },
        {
          path: "/user/watchlist",
          label: t("watchlist"),
          icon: Star,
        },
        {
          path: "/user/stocks",
          label: t("stocks"),
          icon: Database,
        },
      ],
      showNotification: true,
    };
  }, [profile, t]);
}
