import { Calendar, Lock, Mail, Unlock } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AdminUserItem, UserStatus } from "@/types/user/user.type";

interface UserTableProps {
  users: AdminUserItem[];
  togglingId: string | null;
  onToggleStatus: (id: string, currentStatus: UserStatus) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  togglingId,
  onToggleStatus,
  isLoading,
}: UserTableProps) {
  return (
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
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="transition-colors hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="mb-1 h-5 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
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
                  className="transition-colors hover:bg-blue-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-brand-900 text-sm">
                      {user.username}
                    </div>
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
                      <span>
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                    {new Date(user.updatedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full border-2 px-3 py-1 text-xs ${
                        user.status === UserStatus.ACTIVE
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {user.status === UserStatus.ACTIVE
                        ? "Hoạt động"
                        : "Bị khóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ButtonCustom
                      onClick={() => onToggleStatus(user.id, user.status)}
                      disabled={togglingId === user.id}
                      className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-all disabled:opacity-50 ${
                        user.status === UserStatus.ACTIVE
                          ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {user.status === UserStatus.ACTIVE ? (
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
  );
}
