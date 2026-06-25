import {
  Calendar,
  Info,
  KeyRound,
  Lock,
  Mail,
  ShieldAlert,
  Unlock,
} from "lucide-react";
import { useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage } from "@/providers/LanguageProvider";
import { AdminUserItem, UserStatus } from "@/types/user/user.type";

import { ConfirmModal } from "./ConfirmModal";

interface UserTableProps {
  users: AdminUserItem[];
  togglingId: string | null;
  onToggleStatus: (
    id: string,
    currentStatus: UserStatus,
  ) => void | Promise<void>;
  onActionClick?: (
    mode: "edit-roles" | "reset-password" | "view-details",
    user: AdminUserItem,
  ) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  togglingId,
  onToggleStatus,
  onActionClick,
  isLoading,
}: UserTableProps) {
  const { t } = useLanguage();
  const [userToLock, setUserToLock] = useState<AdminUserItem | null>(null);

  const handleConfirmLock = async () => {
    if (!userToLock) {
      return;
    }
    try {
      await onToggleStatus(userToLock.id, userToLock.status);
    } finally {
      setUserToLock(null);
    }
  };

  return (
    <>
      <div className="border-border bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
        <table className="divide-border min-w-full divide-y">
          <thead className="from-brand-900 to-brand-700 bg-linear-to-r text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableUser")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableEmail")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.labelRoles")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableJoinedDate")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableLastLogin")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableStatus")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase">
                {t("adminUsers.tableActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border bg-card divide-y">
            {isLoading
              ? ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((rowKey) => (
                  <tr
                    key={rowKey}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="mb-1 h-5 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-9 w-20 rounded-lg" />
                    </td>
                  </tr>
                ))
              : users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-brand-900 text-sm font-semibold dark:text-neutral-50">
                        {user.username}
                      </div>
                      <div className="text-muted-foreground text-xs">user</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <span
                              key={role}
                              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-800 capitalize dark:bg-neutral-800 dark:text-neutral-200"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap">
                      {new Date(user.updatedAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full border-2 px-3 py-1 text-xs font-medium ${
                          user.status === UserStatus.ACTIVE
                            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-950/30 dark:text-green-400"
                            : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {user.status === UserStatus.ACTIVE
                          ? t("adminUsers.statusActive")
                          : t("adminUsers.statusSuspended")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <ButtonCustom
                          onClick={() => {
                            if (user.status === UserStatus.ACTIVE) {
                              setUserToLock(user);
                            } else {
                              onToggleStatus(user.id, user.status);
                            }
                          }}
                          disabled={togglingId === user.id}
                          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
                            user.status === UserStatus.ACTIVE
                              ? "border-red-250 text-red-755 border bg-red-50 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                              : "border-green-250 text-green-755 border bg-green-50 hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                          }`}
                        >
                          {user.status === UserStatus.ACTIVE ? (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              <span>{t("adminUsers.actionLock")}</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3.5 w-3.5" />
                              <span>{t("adminUsers.actionUnlock")}</span>
                            </>
                          )}
                        </ButtonCustom>

                        <ButtonCustom
                          onClick={() => onActionClick?.("view-details", user)}
                          variant="ghost"
                          size="icon"
                          title={t("adminUsers.actionViewDetails")}
                          className="h-8 w-8 cursor-pointer text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        >
                          <Info className="h-4 w-4" />
                        </ButtonCustom>

                        <ButtonCustom
                          onClick={() => onActionClick?.("edit-roles", user)}
                          variant="ghost"
                          size="icon"
                          title={t("adminUsers.actionEditRoles")}
                          className="hover:text-blue-750 h-8 w-8 cursor-pointer text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </ButtonCustom>

                        <ButtonCustom
                          onClick={() =>
                            onActionClick?.("reset-password", user)
                          }
                          variant="ghost"
                          size="icon"
                          title={t("adminUsers.actionResetPassword")}
                          className="hover:text-yellow-750 dark:hover:text-yellow-355 h-8 w-8 cursor-pointer text-yellow-500 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950/30"
                        >
                          <KeyRound className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={!!userToLock}
        onClose={() => setUserToLock(null)}
        onConfirm={handleConfirmLock}
        title={t("adminUsers.confirmTitle")}
        message={t("adminUsers.confirmMessage", {
          username: userToLock?.username || "",
        })}
        confirmText={t("adminUsers.confirmText")}
        cancelText={t("adminUsers.cancelText")}
        isLoading={togglingId === userToLock?.id}
      />
    </>
  );
}
