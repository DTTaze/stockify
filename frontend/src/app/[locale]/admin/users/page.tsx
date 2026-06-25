"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ButtonCustom } from "@/components/common/form/button";
import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  useMutateCreateUser,
  useMutateResetUserPassword,
  useMutateSyncUserRoles,
  useMutateUserStatus,
  useQueryAdminUsers,
  useQueryAllRoles,
} from "@/queries/users/QueryHooksUser";
import { AdminUserItem, UserStatus } from "@/types/user/user.type";

import {
  UserActionConfirmData,
  UserActionModal,
} from "./components/UserActionModal";
import { UserStats } from "./components/UserStats";
import { UserTable } from "./components/UserTable";
import { UserTablePagination } from "./components/UserTablePagination";

export default function UserManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // New Management states
  const [statusFilter, setStatusFilter] = useState<UserStatus | undefined>(
    undefined,
  );
  const [actionModalMode, setActionModalMode] = useState<
    "create" | "edit-roles" | "reset-password" | "view-details" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

  // Debounce search term to prevent excessive API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const offset = (currentPage - 1) * limit;

  const { data, isLoading } = useQueryAdminUsers({
    limit,
    offset,
    keyword: debouncedSearchTerm || undefined,
    status: statusFilter,
  });

  const { data: roles = [] } = useQueryAllRoles();
  const statusMutation = useMutateUserStatus();
  const createUserMutation = useMutateCreateUser();
  const resetPasswordMutation = useMutateResetUserPassword();
  const syncRolesMutation = useMutateSyncUserRoles();

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    const nextStatus =
      currentStatus === UserStatus.ACTIVE
        ? UserStatus.SUSPENDED
        : UserStatus.ACTIVE;
    setTogglingId(id);
    try {
      await statusMutation.mutateAsync({ id, status: nextStatus });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleActionClick = (
    mode: "edit-roles" | "reset-password" | "view-details",
    user: AdminUserItem,
  ) => {
    setSelectedUser(user);
    setActionModalMode(mode);
  };

  const handleCreateClick = () => {
    setSelectedUser(null);
    setActionModalMode("create");
  };

  const handleModalConfirm = async (formData: UserActionConfirmData) => {
    try {
      if (actionModalMode === "create") {
        const userResult = await createUserMutation.mutateAsync({
          username: formData.username || "",
          email: formData.email || "",
          password: formData.password || "",
          confirmPassword: formData.confirmPassword || "",
        });
        const userId = userResult?.user?.id;
        if (formData.roles?.length && userId) {
          const selectedRoleIds = formData.roles
            .map((rName: string) => roles.find((r) => r.name === rName)?.id)
            .filter((id): id is string => !!id);
          await syncRolesMutation.mutateAsync({
            userId,
            roleIds: selectedRoleIds,
          });
        }
        toast.success(t("adminUsers.toastCreateSuccess"));
      } else if (actionModalMode === "reset-password" && selectedUser) {
        await resetPasswordMutation.mutateAsync({
          id: selectedUser.id,
          password: formData.password || "",
        });
        toast.success(t("adminUsers.toastResetSuccess"));
      } else if (actionModalMode === "edit-roles" && selectedUser) {
        await syncRolesMutation.mutateAsync({
          userId: selectedUser.id,
          roleIds: formData.roleIds || [],
        });
        toast.success(t("adminUsers.toastSyncRolesSuccess"));
      }
      setActionModalMode(null);
      setSelectedUser(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const users = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const stats = data?.stats || {
    totalCount: 0,
    activeCount: 0,
    suspendedCount: 0,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl font-semibold dark:text-neutral-50">
            {t("adminUsers.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("adminUsers.subtitle")}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <InputSearch
            placeholder={t("adminUsers.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ButtonCustom
            onClick={handleCreateClick}
            className="bg-brand-900 dark:bg-brand-700 hover:bg-brand-850 flex h-10 cursor-pointer items-center space-x-1.5 rounded-lg px-4 py-2.5 font-semibold text-white transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t("adminUsers.actionAddUser")}</span>
          </ButtonCustom>
        </div>
      </div>

      <UserStats
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        suspendedCount={stats.suspendedCount}
        isLoading={isLoading}
        activeFilter={statusFilter || "all"}
        onFilterChange={(filter) => {
          if (filter === "all") {
            setStatusFilter(undefined);
          } else {
            setStatusFilter(filter as UserStatus);
          }
          setCurrentPage(1);
        }}
      />

      <div className="space-y-4">
        <UserTable
          users={users}
          togglingId={togglingId}
          onToggleStatus={handleToggleStatus}
          onActionClick={handleActionClick}
          isLoading={isLoading}
        />

        <UserTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setCurrentPage(1);
          }}
        />
      </div>

      <UserActionModal
        isOpen={actionModalMode !== null}
        onClose={() => {
          setActionModalMode(null);
          setSelectedUser(null);
        }}
        mode={actionModalMode}
        user={selectedUser}
        availableRoles={roles}
        onConfirm={handleModalConfirm}
        isLoading={
          createUserMutation.isPending ||
          resetPasswordMutation.isPending ||
          syncRolesMutation.isPending
        }
      />
    </div>
  );
}
