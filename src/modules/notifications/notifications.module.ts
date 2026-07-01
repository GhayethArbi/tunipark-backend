import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { FirebaseAdminService } from './firebase/firebase-admin.service';

import { NotificationRepository } from './repositories/notification.repository';
import { NotificationTokenRepository } from './repositories/notification-token.repository';
import { PrismaNotificationRepository } from './repositories/prisma-notification.repository';
import { PrismaNotificationTokenRepository } from './repositories/prisma-notification-token.repository';

import { RegisterFcmTokenUseCase } from './use-cases/register-fcm-token.use-case';
import { SendNotificationUseCase } from './use-cases/send-notification.use-case';
import { FindUserNotificationsUseCase } from './use-cases/find-user-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read.use-case';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    PrismaService,
    FirebaseAdminService,

    { provide: NotificationRepository, useClass: PrismaNotificationRepository },
    {
      provide: NotificationTokenRepository,
      useClass: PrismaNotificationTokenRepository,
    },

    RegisterFcmTokenUseCase,
    SendNotificationUseCase,
    FindUserNotificationsUseCase,
    MarkNotificationAsReadUseCase,
  ],
  exports: [SendNotificationUseCase],
})
export class NotificationsModule {}