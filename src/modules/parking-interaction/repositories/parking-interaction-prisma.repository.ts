import { Injectable } from '@nestjs/common';
import { ParkingInteractionRepository } from './parking-interaction.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParkingInteractionType } from '../domain/parking-interaction-type.enum';

@Injectable()
export class ParkingInteractionPrismaRepository implements ParkingInteractionRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: {
    userId: string;
    parkingId: string;
    interactionType: ParkingInteractionType;
  }): Promise<void> {
    await this.prisma.parkingInteraction.create({
      data: {
        userId: data.userId,
        parkingId: data.parkingId,
        interactionType: data.interactionType,
      },
    });
  }

  async countRecentViews(parkingId: string, minutes: number): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return this.prisma.parkingInteraction.count({
      where: {
        parkingId,
        interactionType: ParkingInteractionType.VIEW,
        createdAt: {
          gte: since,
        },
      },
    });
  }

  async findLatest() {
    return this.prisma.parkingInteraction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  async countByType(parkingId: string, type: ParkingInteractionType): Promise<number> {
    return this.prisma.parkingInteraction.count({
      where: {
        parkingId,
        interactionType: type,
      },
    });
  }

}
