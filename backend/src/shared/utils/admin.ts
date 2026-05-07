import * as os from 'os';

import {
  ADMIN_DASHBOARD_PERFORMANCE_ACCURACY_BASE,
  ADMIN_DASHBOARD_PERFORMANCE_ACCURACY_STEP,
  ADMIN_DASHBOARD_PERFORMANCE_INTERVAL_HOURS,
  ADMIN_DASHBOARD_PERFORMANCE_LOAD_OFFSET,
  ADMIN_DASHBOARD_PERFORMANCE_LOAD_STEP,
  ADMIN_DASHBOARD_PERFORMANCE_MIN_LOAD,
  ADMIN_DASHBOARD_PERFORMANCE_POINTS,
  ADMIN_DASHBOARD_PERFORMANCE_REQUEST_BASE,
  ADMIN_DASHBOARD_PERFORMANCE_REQUEST_STEP,
} from '@shared/constants';
import { AdminDashboardPerformanceDto } from '@shared/interfaces';

export const getSystemMemoryUsagePercent = (): number =>
  Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);

export const getSystemCpuLoadPercent = (): number =>
  Math.min(100, Math.round((os.loadavg()[0] || 0) * 10));

export const buildAdminDashboardPerformanceData = (
  now = new Date(),
): AdminDashboardPerformanceDto[] => {
  const loadFactor = getSystemMemoryUsagePercent();

  return Array.from(
    { length: ADMIN_DASHBOARD_PERFORMANCE_POINTS },
    (_, index) => {
      const timestamp = new Date(
        now.getTime() -
          (ADMIN_DASHBOARD_PERFORMANCE_POINTS - 1 - index) *
            ADMIN_DASHBOARD_PERFORMANCE_INTERVAL_HOURS *
            60 *
            60 *
            1000,
      );

      return {
        time: timestamp.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        requests:
          ADMIN_DASHBOARD_PERFORMANCE_REQUEST_BASE +
          index * ADMIN_DASHBOARD_PERFORMANCE_REQUEST_STEP,
        accuracy: Math.min(
          100,
          ADMIN_DASHBOARD_PERFORMANCE_ACCURACY_BASE +
            index * ADMIN_DASHBOARD_PERFORMANCE_ACCURACY_STEP,
        ),
        load: Math.min(
          100,
          Math.max(
            ADMIN_DASHBOARD_PERFORMANCE_MIN_LOAD,
            loadFactor +
              index * ADMIN_DASHBOARD_PERFORMANCE_LOAD_STEP -
              ADMIN_DASHBOARD_PERFORMANCE_LOAD_OFFSET,
          ),
        ),
      };
    },
  );
};
