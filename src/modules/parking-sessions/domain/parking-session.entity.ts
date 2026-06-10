import { SessionStatus } from '@prisma/client';

export class ParkingSessionEntity {
  constructor(
    public readonly id: string,

    public readonly userId: string,
    public readonly parkingId: string,

    public readonly vehiclePlate: string,
    public readonly vehicleBrand: string | null,
    public readonly vehicleModel: string | null,

    public readonly startTime: Date,
    public readonly endTime: Date | null,

    public readonly status: SessionStatus,
    public readonly paidDuration: number,

    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === SessionStatus.ACTIVE;
  }

  canBeCancelled(): boolean {
    return (
      this.status === SessionStatus.CREATED ||
      this.status === SessionStatus.ACTIVE
    );
  }

  durationInMinutes(now: Date = new Date()): number {
    const end = this.endTime ?? now;
    const diffMs = end.getTime() - this.startTime.getTime();
    return Math.max(0, Math.ceil(diffMs / 60000));
  }
}