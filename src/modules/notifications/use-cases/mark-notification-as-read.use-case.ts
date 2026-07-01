import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  execute(userId: string, notificationId: string) {
    return this.repo.markAsRead(userId, notificationId);
  }
}