"use client";

import { Calendar, Lock, Mail, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ButtonCustom } from "@/components/common/form/button";
import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { useQueryAdminUsers, useMutateUserStatus } from "@/queries/users/QueryHooksUser";
import { UserStatus } from "@/types/user/user.type";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: users = [] } = useQueryAdminUsers();
  const statusMutation = useMutateUserStatus();

  const handleToggleStatus = async (id: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus =
      currentStatus === "active" ? "suspended" : "active";
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Tổng User</div>
          <div className="text-brand-900 text-3xl">{users.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Đang hoạt động</div>
          <div className="text-3xl text-green-600">
            {users.filter((u) => u.status === "active").length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm text-gray-600">Bị khóa</div>
          <div className="text-3xl text-red-600">
            {users.filter((u) => u.status === "suspended").length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="from-brand-900 to-brand-700 bg-linear-to-r text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Ngày tham gia
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Đăng nhập cuối
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs tracking-wider uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-brand-900 text-sm">{user.username}</div>
                  <div className="text-xs text-gray-500">user</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {new Date(user.updatedAt).toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`rounded-full border-2 px-3 py-1 text-xs ${
                      user.status === "active"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ButtonCustom
                    onClick={() => handleToggleStatus(user.id, user.status)}
                    disabled={togglingId === user.id}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-all disabled:opacity-50 ${
                      user.status === "active"
                        ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {user.status === "active" ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Khóa</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        <span>Mở khóa</span>
                      </>
                    )}
                  </ButtonCustom>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
