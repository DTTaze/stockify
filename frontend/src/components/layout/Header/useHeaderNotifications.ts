"use client";

import { useEffect, useMemo, useState } from "react";

import { useWatchlistWithQuotes } from "@/queries/watchlist/useWatchlistWithQuotes";

import type { NotificationItem } from "./NotificationDropdown";

const READ_STORAGE_KEY = "stockify_header_notification_read_ids";
const DELETED_STORAGE_KEY = "stockify_header_notification_deleted_ids";
const MAX_NOTIFICATIONS = 6;

const readStoredIds = (key: string) => {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const value = localStorage.getItem(key);
    return new Set<string>(value ? JSON.parse(value) : []);
  } catch {
    return new Set<string>();
  }
};

const writeStoredIds = (key: string, ids: Set<string>) => {
  localStorage.setItem(key, JSON.stringify([...ids]));
};

export function useHeaderNotifications(enabled: boolean, locale: string) {
  const { watchlist } = useWatchlistWithQuotes(enabled);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [thresholds, setThresholds] = useState<Record<string, number>>({});

  useEffect(() => {
    setReadIds(readStoredIds(READ_STORAGE_KEY));
    setDeletedIds(readStoredIds(DELETED_STORAGE_KEY));
  }, []);

  useEffect(() => {
    const loadThresholds = () => {
      try {
        const saved = localStorage.getItem("stockify_watchlist_thresholds");
        setThresholds(saved ? JSON.parse(saved) : {});
      } catch {
        setThresholds({});
      }
    };
    loadThresholds();
    window.addEventListener("stockify_threshold_changed", loadThresholds);
    return () => {
      window.removeEventListener("stockify_threshold_changed", loadThresholds);
    };
  }, []);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!enabled) {
      return [];
    }

    return watchlist
      .filter((item) => {
        if (!item.symbol || item.change === 0) {
          return false;
        }

        const limit = thresholds[item.symbol];
        if (limit !== undefined && limit > 0) {
          return item.change < 0 && Math.abs(item.change) >= limit;
        }

        return true;
      })
      .sort((first, second) => Math.abs(second.change) - Math.abs(first.change))
      .slice(0, MAX_NOTIFICATIONS)
      .map((item) => {
        const isPositive = item.change >= 0;
        const change = Math.abs(item.change).toFixed(2);
        const id = `watchlist-${item.symbol}-${isPositive ? "up" : "down"}-${change}`;
        const type: NotificationItem["type"] = isPositive
          ? "success"
          : "warning";

        return {
          id,
          titleKey: isPositive
            ? "notifications.watchlistUp"
            : "notifications.watchlistDown",
          titleValues: {
            symbol: item.symbol,
            change,
          },
          time:
            locale === "vi"
              ? "Dữ liệu thị trường mới nhất"
              : "Latest market data",
          read: readIds.has(id),
          type,
        };
      })
      .filter((notification) => !deletedIds.has(notification.id));
  }, [deletedIds, enabled, locale, readIds, watchlist, thresholds]);

  const markRead = (id: string) => {
    setReadIds((previous) => {
      const next = new Set(previous);
      next.add(id);
      writeStoredIds(READ_STORAGE_KEY, next);
      return next;
    });
  };

  const deleteNotification = (id: string) => {
    setDeletedIds((previous) => {
      const next = new Set(previous);
      next.add(id);
      writeStoredIds(DELETED_STORAGE_KEY, next);
      return next;
    });
  };

  const markAllRead = () => {
    setReadIds((previous) => {
      const next = new Set(previous);
      notifications.forEach((notification) => next.add(notification.id));
      writeStoredIds(READ_STORAGE_KEY, next);
      return next;
    });
  };

  const clearAll = () => {
    setDeletedIds((previous) => {
      const next = new Set(previous);
      notifications.forEach((notification) => next.add(notification.id));
      writeStoredIds(DELETED_STORAGE_KEY, next);
      return next;
    });
  };

  return {
    notifications,
    markRead,
    deleteNotification,
    markAllRead,
    clearAll,
  };
}
