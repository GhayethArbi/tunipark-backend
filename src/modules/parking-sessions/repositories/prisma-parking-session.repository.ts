import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParkingSessionRepository } from './parking-session.repository';
import { SessionStatus } from '@prisma/client';
import { ParkingSessionEntity } from '../domain/parking-session.entity';

@Injectable()
export class PrismaParkingSessionRepository implements ParkingSessionRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: any) {
    const parking = await this.prisma.parking.findFirst({
      where: { id: data.parkingId, archivedAt: null },
    });
    if (!parking) throw new NotFoundException('Parking not found');

    const existingActive = await this.prisma.parkingSession.findFirst({
      where: {
        parkingId: data.parkingId,
        vehiclePlate: data.vehiclePlate,
        status: SessionStatus.ACTIVE,
        archivedAt: null,
      },
    });
    if (existingActive) throw new BadRequestException('Active session already exists for this vehicle');

    return this.prisma.parkingSession.create({
      data: {
        user: { connect: { id: data.userId }, },
        parking: { connect: { id: data.parkingId } },
        vehiclePlate: data.vehiclePlate,
        vehicleBrand: data.vehicleBrand ?? null,
        vehicleModel: data.vehicleModel ?? null,
        startTime: new Date(),
        endTime: null,
        status: SessionStatus.CREATED,
        paidDuration: data.paidDuration,
      },
    });
  }

  findById(id: string) {
    return this.prisma.parkingSession.findFirst({
      where: { id, archivedAt: null },
    });
  }

  listAll() {
    return this.prisma.parkingSession.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  listActive() {
    return this.prisma.parkingSession.findMany({
      where: { archivedAt: null, status: SessionStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByParking(parkingId: string) {
    return this.prisma.parkingSession.findMany({
      where: { archivedAt: null, parkingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async end(id: string) {
    const session = await this.prisma.parkingSession.findFirst({
      where: { id, archivedAt: null },
    });
    if (!session) throw new NotFoundException('Session not found');

    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Only ACTIVE sessions can be ended');
    }

    return this.prisma.parkingSession.update({
      where: { id },
      data: {
        endTime: new Date(),
        status: SessionStatus.EXPIRED,
      },
    });
  }

  async cancel(id: string) {
    const session = await this.prisma.parkingSession.findFirst({
      where: { id, archivedAt: null },
    });
    if (!session) throw new NotFoundException('Session not found');

    // if (session.status !== SessionStatus.ACTIVE && session.status !== SessionStatus.CREATED) {
    //   throw new BadRequestException('Only ACTIVE/CREATED sessions can be cancelled');
    // }

    return this.prisma.parkingSession.update({
      where: { id },
      data: {
        endTime: new Date(),
        status: SessionStatus.CANCELLED,
      },
    });
  }
  async updateEndTime(
    sessionId: string,
    endTime: Date,
  ) {
    return this.prisma.parkingSession.update({
      where: { id: sessionId },
      data: { endTime },
    });
  }
}
 