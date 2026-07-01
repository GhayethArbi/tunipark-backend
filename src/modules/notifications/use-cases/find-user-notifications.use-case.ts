import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class FindUserNotificationsUseCase {
  constructor(private readonly repo: NotificationRepository) {}

  execute(userId: string) {
    return this.repo.findByUserId(userId);
  }
}