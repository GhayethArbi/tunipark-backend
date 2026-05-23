import { Injectable } from '@nestjs/common';
import { ParkingRepository } from '../repositories/parking.repository';
import {
  AccessMode,
  ParkingSpotType,
  ParkingType,
} from '../domain/parking.enums';
import { ParkingVehicleType } from '../domain/parking-vehicle-type.enum';

@Injectable()
export class CreateParkingUseCase {
  constructor(private readonly repo: ParkingRepository) { }

  execute(
    ownerId: string,
    input: {
      title: string;
      type: ParkingType;
      spotType: ParkingSpotType;
      maxPlaces: number;
      openingTime: string;
      closingTime: string;
      vehicleTypes: ParkingVehicleType[];
      description: string;
      characteristics: string[];
      pictures: string[];
      location: Record<string, any>;
      accessMode: AccessMode;
      zoneId?: string | null;
    }
  ) {
    return this.repo.create({
      ...input,
      ownerId,
      availablePlaces: input.maxPlaces,

    });
  }
}