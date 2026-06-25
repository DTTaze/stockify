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
        <p className="text-foreground text-sm dark:text-neutral-200">
          {activity.message}
        </p>

        <p className="text-muted-foreground mt-1 text-xs">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="border-border bg-card flex animate-pulse items-start space-x-3 rounded-xl border-2 p-4">
      <div className="bg-muted h-7 w-7 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="bg-muted h-4 w-5/6 rounded" />
        <div className="bg-muted/70 h-3 w-1/4 rounded" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
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
    <div className="border-border bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-brand-900 text-2xl font-semibold dark:text-neutral-50">
            Hoạt động gần đây
          </h2>

          <p className="text-muted-foreground mt-1 text-sm">
            Cập nhật từ hệ thống
          </p>
        </div>

        {realtimeError ? (
          <span className="text-danger-500 text-xs">Realtime tạm dừng</span>
        ) : (
          <span className="text-success-500 text-xs">
            Realtime đang hoạt động
          </span>
        )}
      </div>

      <div className="space-y-3">{renderContent()}</div>
    </div>
  );
}
