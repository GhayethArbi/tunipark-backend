import { ParkingZone } from '@prisma/client';

export abstract class ParkingZoneRepository {
  abstract create(data: {
    name: string;
    city: string;
    geometry: any;
    auditorId: string;
  }): Promise<ParkingZone>;

  abstract update(id: string, auditorId: string, data: Partial<{
    name: string;
    city: string;
    geometry: any;
  }>): Promise<ParkingZone>;

  abstract findById(id: string, auditorId: string): Promise<ParkingZone | null>;

  abstract list(auditorId: string): Promise<ParkingZone[]>;

  abstract archive(id: string, auditorId: string): Promise<ParkingZone>;
}
