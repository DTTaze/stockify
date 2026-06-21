import { OperationResult } from 'mvc-common-toolkit';

import { Injectable, Logger } from '@nestjs/common';

import { DataManagementService } from '@modules/data-management/services/data-management.service';
import { ModelManagementService } from '@modules/model-management/services/model-management.service';
import { UserService } from '@modules/user/services/user.service';

import {
  ADMIN_DASHBOARD_MAX_ACTIVITIES,
  ADMIN_DASHBOARD_RECENT_USERS_LIMIT,
  ENTITY_STATUS,
} from '@shared/constants';
import {
  AdminDashboardActivityDto,
  AdminDashboardPerformanceDto,
  AdminDashboardRealtimeDto,
  AdminDashboardSummaryDto,
} from '@shared/interfaces';
import {
  buildAdminDashboardPerformanceData,
  getSystemCpuLoadPercent,
  getSystemMemoryUsagePercent,
} from '@shared/utils/admin';

@Injectable()
export class AdminDashboardService {
  protected logger = new Logger(AdminDashboardService.name);

  constructor(
    protected userService: UserService,
    protected modelManagementService: ModelManagementService,
    protected dataManagementService: DataManagementService,
  ) {}

  public async getSummary(): Promise<
    OperationResult<AdminDashboardSummaryDto>
  > {
    try {
      const [users, modelSummaryResult, dataSummaryResult] = await Promise.all([
        this.userService.findAll(),
        this.modelManagementService.getModelSummary(),
        this.dataManagementService.getDataManagementSummary(),
      ]);

      if (!modelSummaryResult.success) {
        return { success: false, message: modelSummaryResult.message };
      }

      if (!dataSummaryResult.success) {
        return { success: false, message: dataSummaryResult.message };
      }

      const usersCount = users.length;
      const activeUsersCount = users.filter(
        (user) => user.status === ENTITY_STATUS.ACTIVE,
      ).length;

      return {
        success: true,
        data: {
          total_users: usersCount,
          active_users: activeUsersCount,
          total_models: modelSummaryResult.data.total_models,
          active_models: modelSummaryResult.data.active_models,
          failed_models: modelSummaryResult.data.failed_models,
          total_stocks: dataSummaryResult.data.totalStocks,
          updated_stocks: dataSummaryResult.data.updated,
          needs_update_stocks: dataSummaryResult.data.needsUpdate,
          total_records: dataSummaryResult.data.totalRecords,
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch admin dashboard summary', error);
      return {
        success: false,
        message: 'Failed to fetch admin dashboard summary',
      };
    }
  }

  public async getPerformance(): Promise<
    OperationResult<AdminDashboardPerformanceDto[]>
  > {
    try {
      const data = buildAdminDashboardPerformanceData();

      return {
        success: true,
        data,
      };
    } catch (error) {
      this.logger.error(
        'Failed to build admin dashboard performance data',
        error,
      );
      return {
        success: false,
        message: 'Failed to fetch performance metrics',
      };
    }
  }

  public async getRecentActivities(): Promise<
    OperationResult<AdminDashboardActivityDto[]>
  > {
    try {
      const [recentUsers, modelSummaryResult, dataSummaryResult] =
        await Promise.all([
          this.userService.findRecentUsers(ADMIN_DASHBOARD_RECENT_USERS_LIMIT),
          this.modelManagementService.getModelSummary(),
          this.dataManagementService.getDataManagementSummary(),
        ]);

      if (!modelSummaryResult.success || !dataSummaryResult.success) {
        const errorMessage = modelSummaryResult.success
          ? dataSummaryResult.message
          : modelSummaryResult.message;

        return { success: false, message: errorMessage };
      }

      const activities: AdminDashboardActivityDto[] = [];

      if (recentUsers.length) {
        activities.push({
          type: 'success',
          message: `Người dùng mới đăng ký: ${recentUsers[0].email}`,
          timestamp: new Date(recentUsers[0].createdAt).toISOString(),
        });
      }

      if (dataSummaryResult.data.updated > 0) {
        activities.push({
          type: 'success',
          message: `Đã xử lý ${dataSummaryResult.data.updated} cổ phiếu`,
          timestamp: new Date().toISOString(),
        });
      }

      if (modelSummaryResult.data.failed_models > 0) {
        activities.push({
          type: 'warning',
          message: `${modelSummaryResult.data.failed_models} model cần kiểm tra`,
          timestamp: new Date().toISOString(),
        });
      }

      activities.push({
        type: 'info',
        message: `Hiện có ${modelSummaryResult.data.active_models} mô hình đang chạy`,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        data: activities.slice(0, ADMIN_DASHBOARD_MAX_ACTIVITIES),
      };
    } catch (error) {
      this.logger.error('Failed to fetch admin dashboard activities', error);
      return {
        success: false,
        message: 'Failed to fetch recent activities',
      };
    }
  }

  public async getRealtime(): Promise<
    OperationResult<AdminDashboardRealtimeDto>
  > {
    try {
      const activeUsersCount = await this.userService.countActiveUsers();
      const memoryUsage = getSystemMemoryUsagePercent();
      const cpuLoad = getSystemCpuLoadPercent();

      return {
        success: true,
        data: {
          cpuLoad,
          memoryUsage,
          activeUsers: activeUsersCount,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to fetch admin dashboard realtime metrics',
        error,
      );
      return {
        success: false,
        message: 'Failed to fetch realtime metrics',
      };
    }
  }
}
