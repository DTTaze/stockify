import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";

interface CreateUserFormProps {
  email: string;
  setEmail: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  selectedRoles: string[];
  handleRoleCheckboxChange: (roleName: string) => void;
  availableRoles: { id: string; name: string }[];
  validationError: string;
}

export function CreateUserForm({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  selectedRoles,
  handleRoleCheckboxChange,
  availableRoles,
  validationError,
}: CreateUserFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {validationError && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {validationError}
        </div>
      )}
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelEmail")} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@domain.com"
          className="border-border bg-card text-foreground focus:border-brand-500 w-full rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelFullName")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="John Doe"
          className="border-border bg-card text-foreground focus:border-brand-500 w-full rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelPassword")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="border-border bg-card text-foreground focus:border-brand-500 w-full rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelConfirmPassword")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="border-border bg-card text-foreground focus:border-brand-500 w-full rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelRoles")}
        </label>
        <div className="flex items-center space-x-6">
          {availableRoles.map((role) => (
            <label
              key={role.id}
              className="text-foreground flex cursor-pointer items-center space-x-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.name)}
                onChange={() => handleRoleCheckboxChange(role.name)}
                className="accent-brand-500 focus:ring-brand-500 h-4 w-4 rounded-sm border-gray-300"
              />
              <span className="capitalize">{role.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
