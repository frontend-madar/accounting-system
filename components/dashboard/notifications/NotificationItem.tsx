"use client";

import * as React from "react";
import { Check, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationItem as NotificationItemType } from "@/types/notification.types";
import { NotificationIcon } from "./NotificationIcon";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import {
  useMarkNotificationRead,
  useDeleteNotification,
} from "@/hooks/use-notification";

interface NotificationItemProps {
  notification: NotificationItemType;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "اليوم";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "أمس";
  } else {
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
    });
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { id, type, title, message, isRead, createdAt } = notification;

  const { mutate: markRead, isPending: isMarkingRead } =
    useMarkNotificationRead();
  const { mutate: deleteNotification, isPending: isDeleting } =
    useDeleteNotification();

  const [isHovered, setIsHovered] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <Card
      className={`
        relative rounded-2xl border transition-all duration-300 ease-in-out
        ${
          isRead
            ? "border-gray-100 bg-white/80 shadow-sm hover:shadow-md"
            : "border-[#0F9D8B]/20 bg-gradient-to-br from-white to-[#F8FFFE] shadow-[0_2px_12px_rgba(15,157,139,0.08)] hover:shadow-[0_4px_20px_rgba(15,157,139,0.12)]"
        }
        min-h-[120px] overflow-hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status bar for unread notifications */}
      {!isRead && (
        <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#0F9D8B] to-[#0F9D8B]/60" />
      )}

      <CardContent className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 p-4 md:p-6">
        {/* Main content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            <NotificationIcon type={type} />
          </div>

          <div className="text-right min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={`
                  text-[18px] md:text-[22px] lg:text-[24px] font-bold leading-tight
                  ${isRead ? "text-gray-600" : "text-[#010204]"}
                  transition-colors duration-200
                `}
              >
                {title}
              </p>
              {!isRead && (
                <span className="inline-flex items-center rounded-full bg-[#0F9D8B]/10 px-2 py-0.5 text-[10px] font-medium text-[#0F9D8B]">
                  جديد
                </span>
              )}
            </div>

            <p
              className={`
                mt-1 text-[15px] md:text-[17px] lg:text-[19px] leading-relaxed
                ${isRead ? "text-gray-500" : "text-[#1E2024]"}
                line-clamp-2 md:line-clamp-none
              `}
            >
              {message}
            </p>

            {/* Mobile timestamp */}
            <div className="mt-2 flex items-center justify-end gap-2 lg:hidden">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-[13px] text-gray-400">
                {formatDate(createdAt)} • {formatTime(createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 self-end lg:self-auto w-full lg:w-auto">
          {/* Mark as read button */}
          {!isRead && (
            <button
              type="button"
              onClick={() => markRead(id)}
              disabled={isMarkingRead}
              className="
                flex items-center gap-1.5 rounded-full 
                bg-[#EAF7F3] px-4 py-2 
                text-[12px] md:text-[13px] font-medium text-[#0F9D8B]
                hover:bg-[#DCF1EB] hover:scale-105
                active:scale-95
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-sm hover:shadow
              "
            >
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">تحديد كمقروء</span>
              <span className="sm:hidden">مقروء</span>
            </button>
          )}

          {/* Delete button */}
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
            className={`
              flex items-center gap-1.5 p-2 rounded-full
              text-gray-400 hover:text-red-500
              hover:bg-red-50
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isHovered ? "opacity-100" : "opacity-70 lg:opacity-40"}
            `}
            aria-label="حذف الإشعار"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline text-[12px] md:text-[13px] font-medium">
              حذف
            </span>
          </button>

          {/* Desktop timestamp & status */}
          <div className="hidden lg:flex items-center gap-3">
            {!isRead && (
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F9D8B] animate-pulse"
                aria-label="إشعار غير مقروء"
              />
            )}
            <div className="flex items-center gap-1.5 text-[14px] text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">
                {formatDate(createdAt)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="whitespace-nowrap">
                {formatTime(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isLoading={isDeleting}
        title="حذف الإشعار"
        description="هل أنت متأكد من حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() =>
          deleteNotification(id, {
            onSuccess: () => setIsDeleteDialogOpen(false),
          })
        }
      />
    </Card>
  );
}