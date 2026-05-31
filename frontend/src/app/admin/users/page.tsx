"use client";

import { useState } from "react";
import { toast } from "sonner";

import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import {
  useMutateUserStatus,
  useQueryAdminUsers,
} from "@/queries/users/QueryHooksUser";
import { UserStatus } from "@/types/user/user.type";

import { UserStats } from "./components/UserStats";
import { UserTable } from "./components/UserTable";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: users = [] } = useQueryAdminUsers();
  const statusMutation = useMutateUserStatus();

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

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalCount = users.length;
  const activeCount = users.filter(
    (u) => u.status === UserStatus.ACTIVE,
  ).length;
  const suspendedCount = users.filter(
    (u) => u.status === UserStatus.SUSPENDED,
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl">Quản lý User</h1>
          <p className="mt-1 text-gray-600">Quản lý tài khoản người dùng</p>
        </div>
        <InputSearch
          placeholder="Tìm kiếm user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UserStats
        totalCount={totalCount}
        activeCount={activeCount}
        suspendedCount={suspendedCount}
      />

      <UserTable
        users={filteredUsers}
        togglingId={togglingId}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
