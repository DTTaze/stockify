import { AxiosResponse } from "axios";

import { ApiResponse } from "@/types/api";
import {
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
};
