import { HttpResponse } from 'mvc-common-toolkit';
import { Observable, from, interval, map, switchMap } from 'rxjs';

import { Controller, Get, Logger, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '@shared/guards/admin.guard';
import { AdminDashboardRealtimeDto } from '@shared/interfaces';

import { AdminDashboardService } from '../services/admin-dashboard.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  protected logger = new Logger(AdminController.name);

  constructor(protected adminDashboardService: AdminDashboardService) {}

  @Get('dashboard/summary')
  @ApiOperation({
    summary: 'Get admin dashboard summary',
    description: 'Aggregate user, model, and data management metrics',
  })
  async getDashboardSummary(): Promise<HttpResponse> {
    return this.adminDashboardService.getSummary();
  }

  @Get('dashboard/performance')
  @ApiOperation({
    summary: 'Get admin dashboard performance data',
    description: 'System performance chart values for dashboard visualization',
  })
  async getDashboardPerformance(): Promise<HttpResponse> {
    return this.adminDashboardService.getPerformance();
  }

  @Get('dashboard/activities')
  @ApiOperation({
    summary: 'Get admin dashboard activity feed',
    description: 'Recent system and user activity for admin overview',
  })
  async getDashboardActivities(): Promise<HttpResponse> {
    return this.adminDashboardService.getRecentActivities();
  }

  @Sse('dashboard/realtime')
  @ApiOperation({
    summary: 'Stream realtime dashboard metrics',
    description: 'Server-sent events for system health updates',
  })
  realtimeDashboard(): Observable<{ data: AdminDashboardRealtimeDto }> {
    return interval(10000).pipe(
      switchMap(() =>
        from(this.adminDashboardService.getRealtime()).pipe(
          map((result) => {
            if (result.success) {
              return { data: result.data };
            }

            return {
              data: {
                cpuLoad: 0,
                memoryUsage: 0,
                activeUsers: 0,
                timestamp: new Date().toISOString(),
              },
            };
          }),
        ),
      ),
    );
  }
}
