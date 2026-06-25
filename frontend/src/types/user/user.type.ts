import { ROLE_NAME } from "@/constants/auth";

export interface ProfileType {
  id: string;
  username: string;
  email: string;
  roles: ROLE_NAME[];
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}

export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
  roleIds?: string[];
}

export interface UserQueryType {
  limit: number;
  offset: number;
  keyword?: string;
  status?: UserStatus;
}

export interface UserStatsType {
  totalCount: number;
  activeCount: number;
  suspendedCount: number;
}

export interface UserPaginatedResponseType {
  rows: AdminUserItem[];
  total: number;
  limit: number;
  offset: number;
  stats: UserStatsType;
}

export interface RoleItem {
  id: string;
  name: string;
  description?: string;
}
