import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParkingZone } from '@prisma/client';
import { ParkingZoneRepository } from './parking-zone.repository';

@Injectable()
export class PrismaParkingZoneRepository implements ParkingZoneRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(data: { name: string; city: string; geometry: any; auditorId: string }): Promise<ParkingZone> {
    return this.prisma.parkingZone.create({ data });
  }

  async update(id: string, auditorId: string, data: any): Promise<ParkingZone> {
    const exists = await this.prisma.parkingZone.findFirst({
      where: { id, auditorId, archivedAt: null },
    });
    if (!exists) throw new NotFoundException('ParkingZone not found');
 
    return this.prisma.parkingZone.update({
      where: { id },
      data,
    });
  }

  findById(id: string, auditorId: string): Promise<ParkingZone | null> {
    return this.prisma.parkingZone.findFirst({
      where: { id, auditorId, archivedAt: null },
    });
  }

  list(auditorId: string): Promise<ParkingZone[]> {
    return this.prisma.parkingZone.findMany({
      where: { auditorId, archivedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async archive(id: string, auditorId: string): Promise<ParkingZone> {
    const exists = await this.prisma.parkingZone.findFirst({
      where: { id, auditorId, archivedAt: null },
    });
    if (!exists) throw new NotFoundException('ParkingZone not found');

    return this.prisma.parkingZone.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }
}
