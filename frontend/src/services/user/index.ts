import { AxiosResponse } from "axios";

import { ApiResponse } from "@/types/api";
import { AdminUserItem, UserStatus } from "@/types/user/user.type";

import axiosClient from "..";

export const userServices = {
  getUsers: (): Promise<AxiosResponse<ApiResponse<AdminUserItem[]>>> =>
    axiosClient.get("user"),

  updateUserStatus: (
    id: string,
    status: UserStatus,
  ): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosClient.patch(`user/${id}/status`, { status }),
};
