"use client";

import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`bg-linear-to-br ${stat.color} rounded-xl p-3 shadow-md`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <span
                className={`rounded-full px-2 py-1 text-sm ${stat.bgColor} ${stat.textColor}`}
              >
                {stat.change}
              </span>
            </div>

            <div className="text-brand-900 mb-1 text-3xl">{stat.value}</div>

            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
