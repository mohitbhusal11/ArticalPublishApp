import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";


export type NotificationResponse = {
    notificationList: NotificationItem[]
}

export type NotificationItem = {
  id: string;
  userId?: number;
  notificationTitle: string;
  notificationMessage: string;
  createdDate: string;
  isRead: boolean;
  entityType?: string | null;
  entityId?: string | number | null;
  status?: 'SENT' | 'FAILED' | 'PENDING';
  failureReason?: string | null;
  iconUrl?: string | null;
  screen?: string;
};



export const fetchNotifications = async () => {
  try {
    const response = await axiosInstance.get<NotificationResponse>(
      Endpoints.Notification.getNotifications
    );

    console.log("fetchNotifications:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("fetchNotifications error:", error?.response?.data || error);
    throw error;
  }
};


export const markNotificationAsRead = async (notificationId: string | number) => {
  try {
    console.log(`Marking notification as read: ${Endpoints.Notification.markAsRead}/${notificationId}`);

    const response = await axiosInstance.put(`${Endpoints.Notification.markAsRead}/${notificationId}`);
    console.log("markNotificationAsRead: ", response.data);
    return response.data;
  } catch (error: any) {
    console.log("markNotificationAsRead error:", error?.response?.data || error);
    throw error;
  }
};
