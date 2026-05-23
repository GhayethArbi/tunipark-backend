import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Parking, ParkingStatus } from '@prisma/client';
import { ParkingRepository } from './parking.repository';

@Injectable()
export class PrismaParkingRepository implements ParkingRepository {
  constructor(private readonly prisma: PrismaService) { }
async listAllWithOwner(zoneId?: string): Promise<any[]> {
  return this.prisma.parking.findMany({
    where: {
      archivedAt: null,
      ...(zoneId ? { zoneId } : {}),
    },
    include: {
      owner: true,
      zone: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async findByIdAdmin(id: string): Promise<any> {
  const parking = await this.prisma.parking.findFirst({
    where: {
      id,
      archivedAt: null,
    },
    include: {
      owner: true,
      zone: true,
    },
  });

  if (!parking) {
    throw new NotFoundException('Parking not found');
  }

  return parking;
}

async setStatus(id: string, status: ParkingStatus): Promise<any> {
  const parking = await this.prisma.parking.findFirst({
    where: {
      id,
      archivedAt: null,
    },
  });

  if (!parking) {
    throw new NotFoundException('Parking not found');
  }

  return this.prisma.parking.update({
    where: { id },
    data: { status },
  });
}

  async create(data: any): Promise<Parking> {
    data.availablePlaces = data.maxPlaces;
    if (data.zoneId) {
      const zone = await this.prisma.parkingZone.findFirst({
        where: {
          id: data.zoneId,
          archivedAt: null,
        },
      });

      if (!zone) {
        throw new NotFoundException('ParkingZone not found');
      }
    }

    return this.prisma.parking.create({ data });
  }

  async update(id: string, ownerId: string, data: any): Promise<Parking> {
    const exists = await this.prisma.parking.findFirst({
      where: { id, ownerId, archivedAt: null },
    });
    if (!exists) throw new NotFoundException('Parking not found');

    // if zoneId changes => validate the new zone belongs to same owner
    if (data.zoneId) {
      const zone = await this.prisma.parkingZone.findFirst({
        where: { id: data.zoneId, archivedAt: null },
      });
      if (!zone) throw new NotFoundException('ParkingZone not found');
    }

    return this.prisma.parking.update({ where: { id }, data });
  }

  findById(id: string, ownerId: string): Promise<Parking | null> {
    return this.prisma.parking.findFirst({
      where: { id, ownerId, archivedAt: null },
    });
  }

  list(ownerId: string, zoneId?: string): Promise<Parking[]> {
    return this.prisma.parking.findMany({
      where: {
        ownerId,
        archivedAt: null,
        ...(zoneId ? { zoneId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }


  async listAllActive(zoneId?: string) {
    return this.prisma.parking.findMany({
      where: {
        archivedAt: null,
        ...(zoneId ? { zoneId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      // optional: include zone or tariff if you want
      // include: { zone: true, tariff: true },
    });
  }

  async archive(id: string, ownerId: string): Promise<Parking> {
    const exists = await this.prisma.parking.findFirst({
      where: { id, ownerId, archivedAt: null },
    });
    if (!exists) throw new NotFoundException('Parking not found');

    return this.prisma.parking.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }
}
