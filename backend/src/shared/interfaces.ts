import { Request } from 'express';
import { FindOptionsRelations, FindOptionsSelect, QueryRunner } from 'typeorm';

import {
  ENTITY_STATUS,
  PARTNER_AUTH_TYPE,
  PARTNER_DIRECTION,
  PARTNER_TYPE,
} from './constants';

export interface RunnerUser {
  alias: string;
  runner: QueryRunner;
}

export interface UserAuthProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface SystemUserAuthProfile {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isSuperAdmin: boolean;
  isPassCodeSet?: boolean;
  isTwoFactorEnabled?: boolean;
}

export interface PartnerAuthProfile {
  id: string;
  name: string;
  direction: PARTNER_DIRECTION;
  type: PARTNER_TYPE;
  authType: PARTNER_AUTH_TYPE;
  status: ENTITY_STATUS;
  baseUrl: string;
}

export interface RequestContextData {
  systemUser?: SystemUserAuthProfile;
  user?: UserAuthProfile;
  partner?: PartnerAuthProfile;
  trace: string;
  span: string;
  parentSpan?: string;
}

export interface AppRequest extends Request {
  context: RequestContextData;
}

export interface FindOptions {
  select?: FindOptionsSelect<any>;
  relations?: FindOptionsRelations<any>;
  withDeleted?: boolean;
}

export interface AdminDashboardSummaryDto {
  total_users: number;
  active_users: number;
  total_models: number;
  active_models: number;
  failed_models: number;
  total_stocks: number;
  updated_stocks: number;
  needs_update_stocks: number;
  total_records: number;
}

export interface AdminDashboardPerformanceDto {
  time: string;
  requests: number;
  accuracy: number;
  load: number;
}

export type AdminDashboardActivityType = 'success' | 'warning' | 'info';

export interface AdminDashboardActivityDto {
  type: AdminDashboardActivityType;
  message: string;
  timestamp: string;
}

export interface AdminDashboardRealtimeDto {
  cpuLoad: number;
  memoryUsage: number;
  activeUsers: number;
  timestamp: string;
}
