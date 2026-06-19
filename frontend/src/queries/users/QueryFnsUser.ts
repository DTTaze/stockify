import { getProfileHandlers } from "@/services/auth/authHandlers";
import { getUsersHandler } from "@/services/user/userHandlers";
import {
  ProfileType,
  UserPaginatedResponseType,
  UserQueryType,
} from "@/types/user/user.type";

export const getProfileQueryFn = async (): Promise<ProfileType> => {
  const response = await getProfileHandlers();

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch profile");
  }

  return response.data;
};

export const getUsersQueryFn = async (
  params: UserQueryType,
): Promise<UserPaginatedResponseType> => {
  const response = await getUsersHandler(params);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};
