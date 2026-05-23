import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Tariff } from '@prisma/client';
import { TariffRepository } from './tariff.repository';

@Injectable()
export class PrismaTariffRepository implements TariffRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: any): Promise<Tariff> {
    // 1) verify parking exists + belongs to owner


    const parking = await this.prisma.parking.findFirst({
      where: { id: data.parkingId, ownerId: data.ownerId, archivedAt: null },
    });
    if (!parking) throw new NotFoundException('Parking not found');

    // 2) ensure no existing tariff for this parking (1–1)
    const existing = await this.prisma.tariff.findFirst({
      where: { parkingId: data.parkingId, archivedAt: null },
    });
    console.log("owner : ", data.ownerId);
    console.log("parkingId : ", data.parkingId);
    if (existing) throw new ConflictException('Tariff already exists for this parking');

    return this.prisma.tariff.create({
      data: {
        pricePerUnit: data.pricePerUnit,
        pricePerDay: data.pricePerDay,
        pricePerMonth: data.pricePerMonth,
        minDuration: data.minDuration,
        maxDuration: data.maxDuration,
        parking: { connect: { id: data.parkingId } },
      },
    });
  }

  async update(id: string, ownerId: string, data: any): Promise<Tariff> {
    console.log("update use case start ...")
    // ensure tariff belongs to owner's parking
    const exists = await this.prisma.tariff.findFirst({
      where: { id, archivedAt: null, parking: { ownerId } },
      include: { parking: true },
    });
    if (!exists) throw new NotFoundException('Tariff not found');

    return this.prisma.tariff.update({
      where: { id },
      data,
    });
  }

  async updateByParkingId(
    parkingId: string,
    ownerId: string,
    data: Partial<{
      pricePerUnit: number;
      pricePerDay: number;
      pricePerMonth: number;
      minDuration: number;
      maxDuration: number;
    }>,
  ): Promise<Tariff> {
    const tariff = await this.prisma.tariff.findFirst({
      where: {
        parkingId,
        archivedAt: null,
        parking: {
          ownerId,
          archivedAt: null,
        },
      },
    });

    if (!tariff) {
      throw new NotFoundException('Tariff not found for this parking');
    }

    return this.prisma.tariff.update({
      where: {
        id: tariff.id,
      },
      data: {
        pricePerUnit: data.pricePerUnit,
        pricePerDay: data.pricePerDay,
        pricePerMonth: data.pricePerMonth,
        minDuration: data.minDuration,
        maxDuration: data.maxDuration,
      },
    });
  }
  findByParkingId(parkingId: string, ownerId: string): Promise<Tariff | null> {
    return this.prisma.tariff.findFirst({
      where: { parkingId, archivedAt: null, parking: { ownerId } },
    });
  }

  async archive(id: string, ownerId: string): Promise<Tariff> {
    const exists = await this.prisma.tariff.findFirst({
      where: { id, archivedAt: null, parking: { ownerId } },
    });
    if (!exists) throw new NotFoundException('Tariff not found');

    return this.prisma.tariff.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }

}
