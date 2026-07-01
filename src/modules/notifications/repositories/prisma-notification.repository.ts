import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: Record<string, any>;
  }) {
    return this.prisma.notification.create({ data });
  }

  findByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}