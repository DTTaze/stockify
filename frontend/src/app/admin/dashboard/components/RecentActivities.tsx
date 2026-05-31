"use client";

import {
  ACTIVITY_CONFIG,
  AdminDashboardActivityTypeItem,
} from "@/types/admin/admin.type";
import { formatRelativeTime } from "@/utils/string";

interface RecentActivitiesProps {
  activities: AdminDashboardActivityTypeItem[];
  isLoading: boolean;
  realtimeError: string | null;
}

interface ActivityItemProps {
  activity: AdminDashboardActivityTypeItem;
}

function ActivityItem(props: ActivityItemProps) {
  const { activity } = props;
  const config = ACTIVITY_CONFIG[activity.type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start space-x-3 rounded-xl border-2 p-4 transition-all hover:shadow-sm ${config.container}`}
    >
      <div className={`rounded-lg p-1.5 ${config.iconBg}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1">
        <p className="text-brand-900 text-sm">{activity.message}</p>

        <p className="mt-1 text-xs text-gray-500">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex animate-pulse items-start space-x-3 rounded-xl border-2 border-gray-100 bg-white p-4">
      <div className="h-7 w-7 shrink-0 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-1/4 rounded bg-gray-200/70" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
      Chưa có hoạt động gần đây.
    </div>
  );
}

export function RecentActivities({
  activities,
  isLoading,
  realtimeError,
}: RecentActivitiesProps) {
  const renderContent = () => {
    if (isLoading) {
      return ["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
        <ActivitySkeleton key={key} />
      ));
    }

    if (activities.length === 0) {
      return <EmptyState />;
    }

    return activities.map((activity) => (
      <ActivityItem
        key={`${activity.timestamp}-${activity.message}`}
        activity={activity}
      />
    ));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-brand-900 text-2xl">Hoạt động gần đây</h2>

          <p className="mt-1 text-sm text-gray-600">Cập nhật từ hệ thống</p>
        </div>

        {realtimeError ? (
          <span className="text-xs text-red-500">Realtime tạm dừng</span>
        ) : (
          <span className="text-xs text-green-600">
            Realtime đang hoạt động
          </span>
        )}
      </div>

      <div className="space-y-3">{renderContent()}</div>
    </div>
  );
}
