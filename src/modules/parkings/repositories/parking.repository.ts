import {
  Parking,
  AccessMode,
  ParkingSpotType,
  ParkingStatus,
  ParkingType,
  ParkingVehicleType,
} from '@prisma/client';

export abstract class ParkingRepository {
  abstract create(data: {
    title: string;

    type: ParkingType;
    spotType: ParkingSpotType;
    maxPlaces: number;
    availablePlaces: number;
    openingTime: string;
    closingTime: string;
    vehicleTypes: ParkingVehicleType[];
    description: string;

    characteristics: string[];
    pictures: string[];

    location: Record<string, any>;

    status?: ParkingStatus;
    accessMode: AccessMode;

    zoneId?: string | null;
    ownerId: string;
  }): Promise<Parking>;

  abstract update(id: string, ownerId: string, data: any): Promise<Parking>;

  abstract findById(id: string, ownerId: string): Promise<Parking | null>;

  abstract list(ownerId: string, zoneId?: string): Promise<Parking[]>;

  abstract archive(id: string, ownerId: string): Promise<Parking>;

  abstract listAllActive(zoneId?: string): Promise<Parking[]>;

  abstract listAllWithOwner(zoneId?: string): Promise<any[]>  // join owner user
  abstract findByIdAdmin(id: string): Promise<any>            // full detail + owner
  abstract setStatus(id: string, status: ParkingStatus): Promise<any>
}
