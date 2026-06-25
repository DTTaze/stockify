import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { AdminUserItem } from "@/types/user/user.type";

interface ViewDetailsContentProps {
  user: AdminUserItem | null;
}

export function ViewDetailsContent({ user }: ViewDetailsContentProps) {
  const { t } = useLanguage();

  if (!user) {
    return null;
  }

  const details = [
    { label: "ID Người dùng", value: user.id },
    { label: t("adminUsers.labelEmail"), value: user.email },
    { label: t("adminUsers.labelFullName"), value: user.username },
    {
      label: t("adminUsers.labelStatus"),
      value: (
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            user.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-950/30 dark:text-green-400"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400"
          }`}
        >
          {user.status === "active"
            ? t("adminUsers.statusActive")
            : t("adminUsers.statusSuspended")}
        </span>
      ),
    },
    {
      label: t("adminUsers.labelRoles"),
      value: user.roles?.length ? (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <span
              key={role}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-800 capitalize dark:bg-neutral-800 dark:text-neutral-200"
            >
              {role}
            </span>
          ))}
        </div>
      ) : (
        "—"
      ),
    },
    {
      label: t("adminUsers.labelCreatedAt"),
      value: new Date(user.createdAt).toLocaleString("vi-VN"),
    },
    {
      label: t("adminUsers.labelUpdatedAt"),
      value: new Date(user.updatedAt).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex justify-between gap-4 py-3 text-sm"
          >
            <span className="text-muted-foreground shrink-0 font-medium">
              {detail.label}
            </span>
            <span className="text-foreground text-right font-semibold break-all">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
