import { AxiosResponse } from "axios";

import { ApiResponse } from "@/types/api";
import {
  RoleItem,
  UserPaginatedResponseType,
  UserQueryType,
  UserStatus,
} from "@/types/user/user.type";

import axiosClient from "..";

export const userServices = {
  getUsers: (
    params: UserQueryType,
  ): Promise<AxiosResponse<ApiResponse<UserPaginatedResponseType>>> =>
    axiosClient.get("user", { params }),

  updateUserStatus: (
    id: string,
    status: UserStatus,
  ): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosClient.patch(`user/${id}/status`, { status }),

  resetPassword: (
    id: string,
    password?: string,
  ): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosClient.patch(`user/${id}/reset-password`, { password }),

  syncUserRoles: (
    userId: string,
    roleIds: string[],
  ): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosClient.put(`admin/user-roles/user/${userId}`, { roleIds }),

  getAllRoles: (): Promise<AxiosResponse<ApiResponse<RoleItem[]>>> =>
    axiosClient.get("admin/roles"),
};
