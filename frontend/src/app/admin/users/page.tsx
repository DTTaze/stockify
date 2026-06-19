"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import {
  useMutateUserStatus,
  useQueryAdminUsers,
} from "@/queries/users/QueryHooksUser";
import { UserStatus } from "@/types/user/user.type";

import { UserStats } from "./components/UserStats";
import { UserTable } from "./components/UserTable";
import { UserTablePagination } from "./components/UserTablePagination";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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
  });

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
        totalCount={stats.totalCount}
        activeCount={stats.activeCount}
        suspendedCount={stats.suspendedCount}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        <UserTable
          users={users}
          togglingId={togglingId}
          onToggleStatus={handleToggleStatus}
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
    </div>
  );
}
