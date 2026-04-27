"use client";

import { Calendar, Lock, Mail, Search, Unlock } from "lucide-react";
import { useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "locked";
  joinedDate: string;
  lastLogin: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "nguyenvana@example.com",
      name: "Nguyễn Văn A",
      role: "user",
      status: "active",
      joinedDate: "2024-01-15",
      lastLogin: "2026-03-20 09:30",
    },
    {
      id: "2",
      email: "tranthib@example.com",
      name: "Trần Thị B",
      role: "user",
      status: "active",
      joinedDate: "2024-02-20",
      lastLogin: "2026-03-19 14:22",
    },
    {
      id: "3",
      email: "levanc@example.com",
      name: "Lê Văn C",
      role: "user",
      status: "locked",
      joinedDate: "2024-03-10",
      lastLogin: "2026-03-15 11:05",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "locked" : "active" }
          : user,
      ),
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-900 text-3xl">Quản lý User</h1>
          <p className="mt-1 text-gray-600">Quản lý tài khoản người dùng</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-accent-500 focus:ring-accent-500 rounded-lg border-2 border-gray-200 py-2 pr-4 pl-10 transition-all outline-none focus:ring-2"
            />
          </div>
        </div>
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
            {users.filter((u) => u.status === "locked").length}
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
                  <div className="text-brand-900 text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
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
                    <span>{user.joinedDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {user.lastLogin}
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
                    onClick={() => toggleUserStatus(user.id)}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-all ${
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
