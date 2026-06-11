import { ParkingSession } from '@prisma/client';
import { ParkingSessionEntity } from '../domain/parking-session.entity';

export abstract class ParkingSessionRepository {
  abstract create(data: {
    userId: string;
    parkingId: string;
    vehiclePlate: string;
    vehicleBrand?: string;
    vehicleModel?: string;
  }): Promise<ParkingSession>;

  abstract findById(id: string): Promise<ParkingSession | null>;

  abstract listAll(): Promise<ParkingSession[]>;
  abstract listActive(): Promise<ParkingSession[]>;
  abstract listByParking(parkingId: string): Promise<ParkingSession[]>;
  abstract updateEndTime(sessionId: string, endTime: Date): Promise<any>;
  abstract end(id: string): Promise<ParkingSession>;
  abstract cancel(id: string): Promise<ParkingSession>;
}
