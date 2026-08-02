import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification.service";
import { getErrorMessage } from "@/lib/axios";
import type { GetNotificationsParams } from "@/types/notification.types";

export const NOTIFICATIONS_QUERY_KEY = "notifications";
export const NOTIFICATIONS_UNREAD_COUNT_KEY = "notifications-unread-count";

export function useNotifications(params: GetNotificationsParams = {}) {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationService.getNotifications(params),
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: [NOTIFICATIONS_UNREAD_COUNT_KEY],
    queryFn: () => notificationService.getUnreadCount(),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: (res) => {
      toast.success(res.message || "تم تحديد جميع الإشعارات كمقروءة");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_UNREAD_COUNT_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الإشعارات"));
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_UNREAD_COUNT_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث الإشعار"));
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: (res) => {
      toast.success(res.message || "تم حذف الإشعار بنجاح");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_UNREAD_COUNT_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف الإشعار"));
    },
  });
}