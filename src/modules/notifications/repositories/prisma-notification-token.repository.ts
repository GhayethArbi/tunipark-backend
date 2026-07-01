import { Injectable } from '@nestjs/common';
import { NotificationTokenRepository } from './notification-token.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PrismaNotificationTokenRepository
  implements NotificationTokenRepository
{
  constructor(private readonly prisma: PrismaService) {}

  saveToken(data: { userId: string; token: string; platform?: string }) {
    return this.prisma.fcmToken.upsert({
      where: { token: data.token },
      update: {
        userId: data.userId,
        platform: data.platform,
      },
      create: data,
    });
  }

  async findTokensByUserId(userId: string): Promise<string[]> {
    const tokens = await this.prisma.fcmToken.findMany({
      where: { userId },
      select: { token: true },
    });

    return tokens.map((item) => item.token);
  }
}