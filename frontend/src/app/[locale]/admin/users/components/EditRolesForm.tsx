import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { AdminUserItem } from "@/types/user/user.type";

interface EditRolesFormProps {
  user: AdminUserItem | null;
  userRoles: string[];
  handleRoleCheckboxChange: (roleName: string) => void;
  availableRoles: { id: string; name: string; description?: string }[];
  validationError: string;
}

export function EditRolesForm({
  user,
  userRoles,
  handleRoleCheckboxChange,
  availableRoles,
  validationError,
}: EditRolesFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-muted-foreground text-sm">
          Thay đổi vai trò hệ thống cho tài khoản{" "}
          <strong>{user?.username}</strong> ({user?.email}):
        </p>
      </div>
      {validationError && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {validationError}
        </div>
      )}
      <div className="border-border bg-muted/20 rounded-xl border p-4">
        <label className="text-muted-foreground mb-3 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelRoles")}
        </label>
        <div className="flex flex-col space-y-3">
          {availableRoles.map((role) => (
            <label
              key={role.id}
              className="text-foreground flex cursor-pointer items-center space-x-3 text-sm"
            >
              <input
                type="checkbox"
                checked={userRoles.includes(role.name)}
                onChange={() => handleRoleCheckboxChange(role.name)}
                className="accent-brand-500 focus:ring-brand-500 h-4.5 w-4.5 rounded-sm border-gray-300"
              />
              <div>
                <span className="text-foreground font-semibold capitalize">
                  {role.name}
                </span>
                {role.description && (
                  <p className="text-muted-foreground text-xs">
                    {role.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
