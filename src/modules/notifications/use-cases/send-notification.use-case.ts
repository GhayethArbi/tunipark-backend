import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationTokenRepository } from '../repositories/notification-token.repository';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly tokenRepo: NotificationTokenRepository,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async execute(params: {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: Record<string, string>;
  }) {
    const notification = await this.notificationRepo.create(params);

    const tokens = await this.tokenRepo.findTokensByUserId(params.userId);

    await Promise.all(
      tokens.map((token) =>
        this.firebaseAdmin.sendToToken(token, params.title, params.body, {
          type: params.type,
          notificationId: notification.id,
          ...(params.data ?? {}),
        }),
      ),
    );

    return notification;
  }
}