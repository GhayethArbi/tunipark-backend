import { Injectable } from '@nestjs/common';
import { NotificationTokenRepository } from '../repositories/notification-token.repository';

@Injectable()
export class RegisterFcmTokenUseCase {
  constructor(private readonly repo: NotificationTokenRepository) {}

  execute(userId: string, token: string, platform?: string) {
    return this.repo.saveToken({ userId, token, platform });
  }
}