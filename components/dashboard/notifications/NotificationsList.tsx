"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NotificationGroup } from "./NotificationGroup";
 import MainButton from "../shared/MainButton";
import { CheckCheck } from "lucide-react";
import {
  useNotifications,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notification";
import type { NotificationItem } from "@/types/notification.types";
import { NotificationItemSkeleton } from "./NotificationItemSkeleton";

interface NotificationsListProps {
  className?: string;
}

function formatDateKey(dateStr: string): string {
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function groupLabelForDate(dateKey: string): string {
  const today = formatDateKey(new Date().toISOString());
  const yesterday = formatDateKey(
    new Date(Date.now() - 86400000).toISOString()
  );

  if (dateKey === today) return "اليوم";
  if (dateKey === yesterday) return "أمس";
  return dateKey;
}

function groupNotificationsByDate(items: NotificationItem[]) {
  const map = new Map<string, NotificationItem[]>();

  for (const item of items) {
    const key = formatDateKey(item.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, groupItems]) => ({
      id: key,
      label: groupLabelForDate(key),
      items: groupItems,
    }));
}

export function NotificationsList({ className }: NotificationsListProps) {
  const { data: apiResponse, isLoading } = useNotifications({ limit: 50 });
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications = apiResponse?.data?.data ?? [];
  const groups = groupNotificationsByDate(notifications);
  const hasUnread = notifications.some((n) => !n.isRead);

  if (isLoading) {
    return (
      <div className={cn("w-full space-y-6", className)}>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <NotificationItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-white p-8 text-center text-[#6B6B70] ctm-shadow",
          className
        )}
      >
        لا توجد إشعارات حتى الآن
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {hasUnread && (
        <div className="flex justify-end">
          <MainButton
            text={isMarkingAll ? "جاري التحديث..." : "تحديد الكل كمقروء"}
            icon={<CheckCheck className="h-4 w-4" />}
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
          />
        </div>
      )}

      {groups.map((group) => (
        <NotificationGroup key={group.id} group={group} />
      ))}
    </div>
  );
}