import React from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { AdminUserItem } from "@/types/user/user.type";

interface ResetPasswordFormProps {
  user: AdminUserItem | null;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (val: string) => void;
  validationError: string;
}

export function ResetPasswordForm({
  user,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  validationError,
}: ResetPasswordFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-muted-foreground text-sm">
          Đặt lại mật khẩu cho tài khoản <strong>{user?.username}</strong>:
        </p>
      </div>
      {validationError && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {validationError}
        </div>
      )}
      <div>
        <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
          {t("adminUsers.labelPassword")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="••••••••"
          className="border-border bg-card text-foreground focus:border-brand-500 w-full rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => {
            const randomPass = Math.random().toString(36).slice(-8) + "1a";
            setNewPassword(randomPass);
            setConfirmNewPassword(randomPass);
          }}
          className="text-brand-500 hover:text-brand-600 cursor-pointer text-xs font-semibold underline"
        >
          Tạo mật khẩu ngẫu nhiên
        </button>
      </div>
      {newPassword && newPassword === confirmNewPassword && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 text-xs text-yellow-800 dark:border-yellow-900/30 dark:text-yellow-400">
          Mật khẩu được đặt:{" "}
          <strong className="font-mono text-sm">{newPassword}</strong> (Hãy lưu
          lại mật khẩu này).
        </div>
      )}
    </div>
  );
}
