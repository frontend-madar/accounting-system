import { api } from "@/lib/axios";
import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  GetUnreadCountResponse,
  MarkAllReadResponse,
  MarkReadResponse,
  DeleteNotificationResponse,
} from "@/types/notification.types";

export const notificationService = {
  getNotifications: (params: GetNotificationsParams = {}) =>
    api
      .get<GetNotificationsResponse>("/notifications", { params })
      .then((res) => res.data),

  getUnreadCount: () =>
    api
      .get<GetUnreadCountResponse>("/notifications/unread-count")
      .then((res) => res.data),

  markAllRead: () =>
    api
      .patch<MarkAllReadResponse>("/notifications/read-all")
      .then((res) => res.data),

  markRead: (id: string) =>
    api
      .patch<MarkReadResponse>(`/notifications/${id}/read`)
      .then((res) => res.data),

  deleteNotification: (id: string) =>
    api
      .delete<DeleteNotificationResponse>(`/notifications/${id}`)
      .then((res) => res.data),
};