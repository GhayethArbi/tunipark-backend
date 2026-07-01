import { Injectable, Logger } from '@nestjs/common';
import { ParkingRepository } from '../repositories/parking.repository';
import {
  AccessMode,
  ParkingSpotType,
  ParkingType,
} from '../domain/parking.enums';
import { ParkingVehicleType } from '../domain/parking-vehicle-type.enum';
import { SendNotificationUseCase } from 'src/modules/notifications/use-cases/send-notification.use-case';

@Injectable()
export class CreateParkingUseCase {
  private readonly logger = new Logger(CreateParkingUseCase.name);

  constructor(
    private readonly repo: ParkingRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) { }
  async execute(
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
    const parking = await this.repo.create({
      ...input,
      ownerId,
      availablePlaces: input.maxPlaces,
    });


    try {
      await this.sendNotificationUseCase.execute({
        userId: ownerId,
        title: 'Parking submitted',
        body: `"${parking.title}" was created and is pending review.`,
        type: 'PARKING_CREATED',
        data: {
          parkingId: parking.id,
          status: parking.status,
        },
      });
    } catch (err) {
      this.logger.warn(
        `Failed to send parking-created notification for parking ${parking.id}: ${err instanceof Error ? err.message : err}`,
      );
    }
    return parking;
  }
}