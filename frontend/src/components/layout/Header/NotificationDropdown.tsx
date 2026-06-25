"use client";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/providers/LanguageProvider";

export interface NotificationItem {
  id: string;
  titleKey: string;
  titleValues?: Record<string, string | number>;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

// Declarative style map configuration for Notification types
const ICON_STYLES = {
  success: {
    bg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    Icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    Icon: TrendingUp,
  },
} as const;

/**
 * NotificationIcon component
 * Responsibility: Decouples rendering specific Lucide icons & color palettes based on type.
 */
function NotificationIcon({ type }: { type: NotificationItem["type"] }) {
  const config = ICON_STYLES[type] || ICON_STYLES.info;
  const LucideIcon = config.Icon;

  return (
    <div className={`shrink-0 rounded-full p-2 ${config.bg}`}>
      <LucideIcon className="h-4.5 w-4.5" />
    </div>
  );
}

/**
 * NotificationRow component
 * Responsibility: Renders a single localized notification list item.
 */
interface NotificationRowProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationRow({
  notification,
  onMarkRead,
  onDelete,
}: NotificationRowProps) {
  const { t } = useLanguage();

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`group relative flex cursor-pointer items-start space-x-3 p-4 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-neutral-800/30 ${
        !notification.read ? "bg-blue-50/20 dark:bg-blue-950/5" : ""
      }`}
    >
      <NotificationIcon type={notification.type} />

      <div className="flex-1 pr-6">
        <p
          className={`text-sm leading-snug transition-colors ${
            !notification.read
              ? "font-semibold text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-neutral-300"
          }`}
        >
          {t(notification.titleKey, notification.titleValues)}
        </p>
        <span className="mt-1 block text-[10px] text-gray-400 dark:text-neutral-500">
          {notification.time}
        </span>
      </div>

      <div className="absolute top-4 right-3 flex items-center space-x-1">
        {!notification.read && (
          <span className="block h-2 w-2 rounded-full bg-blue-500 group-hover:hidden" />
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="cursor-pointer text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400"
          title="Xóa thông báo"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

/**
 * NotificationList component
 * Responsibility: Renders a collection of notifications or returns an empty placeholder state.
 */
interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationList({
  notifications,
  onMarkRead,
  onDelete,
}: NotificationListProps) {
  const { t } = useLanguage();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-2 rounded-full bg-gray-100 p-3 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500">
          <Bell className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
          {t("notifications.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[360px] divide-y divide-gray-50 overflow-y-auto dark:divide-neutral-800/40">
      {notifications.map((notif) => (
        <NotificationRow
          key={notif.id}
          notification={notif}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/**
 * NotificationDropdown component
 * Responsibility: Main layout orchestrator representing the notification popover button, popover contents header, and footer.
 */
export default function NotificationDropdown({
  notifications,
  onMarkRead,
  onDelete,
  onMarkAllRead,
  onClearAll,
}: NotificationDropdownProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="group/bell relative cursor-pointer rounded-lg p-2 text-white/80 outline-hidden transition-all select-none hover:bg-white/10 hover:text-white">
          <Bell className="h-5 w-5 transition-transform duration-200 group-hover/bell:scale-110" />
          {unreadCount > 0 && (
            <span className="bg-accent-500 border-brand-900 absolute top-1 right-1 h-2 w-2 rounded-full border dark:border-neutral-950" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 overflow-hidden rounded-xl border border-gray-200/80 bg-white/95 p-0 shadow-2xl backdrop-blur-md sm:w-[420px] dark:border-neutral-800/80 dark:bg-neutral-900/95"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800/60">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 dark:text-white">
              {t("notifications.title")}
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="h-5 rounded-full px-2 py-0.5 text-[10px] font-bold"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllRead();
              }}
              className="flex h-auto cursor-pointer items-center gap-1 p-0 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Check className="size-3" />
              <span>{t("notifications.markAllRead")}</span>
            </Button>
          )}
        </div>

        <NotificationList
          notifications={notifications}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />

        {notifications.length > 0 && (
          <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-4 py-2.5 dark:border-neutral-800/60 dark:bg-neutral-900/40">
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
                setIsOpen(false);
              }}
              className="flex h-7 cursor-pointer items-center gap-1.5 px-3 py-1 text-xs font-semibold"
            >
              <Trash2 className="size-3.5" />
              <span>{t("notifications.clearAll")}</span>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
