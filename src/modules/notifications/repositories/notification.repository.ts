export abstract class NotificationRepository {
  abstract create(data: {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: Record<string, any>;
  }): Promise<any>;

  abstract findByUserId(userId: string): Promise<any[]>;

  abstract markAsRead(userId: string, notificationId: string): Promise<any>;
}