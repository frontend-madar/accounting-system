export interface NotificationItem {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  relatedEntityType: string;
  relatedEntityId: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

export interface NotificationsPaginatedData {
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: NotificationsPaginatedData;
  message?: string;
}

export interface GetUnreadCountResponse {
  success: boolean;
  data: { count: number };
  message?: string;
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
  data?: NotificationItem;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}