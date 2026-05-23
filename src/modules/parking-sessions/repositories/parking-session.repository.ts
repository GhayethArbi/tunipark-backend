import { ParkingSession } from '@prisma/client';

export abstract class ParkingSessionRepository {
  abstract create(data: {
    parkingId: string;
    vehiclePlate: string;
    vehicleBrand?: string;
    vehicleModel?: string;
  }): Promise<ParkingSession>;

  abstract findById(id: string): Promise<ParkingSession | null>;

  abstract listAll(): Promise<ParkingSession[]>;
  abstract listActive(): Promise<ParkingSession[]>;
  abstract listByParking(parkingId: string): Promise<ParkingSession[]>;

  abstract end(id: string): Promise<ParkingSession>;
  abstract cancel(id: string): Promise<ParkingSession>;
}
