import { Inject, Injectable } from '@nestjs/common';
import {
  PARKING_INTERACTION_REPOSITORY,
  ParkingInteractionRepository,
} from '../repositories/parking-interaction.repository';
import { ParkingInteractionType } from '../domain/parking-interaction-type.enum';

@Injectable()
export class GetParkingAiScoreUseCase {
  constructor(
    @Inject(PARKING_INTERACTION_REPOSITORY)
    private readonly repository: ParkingInteractionRepository,
  ) {}

  async execute(parkingId: string) {
    const views = await this.repository.countByType(
      parkingId,
      ParkingInteractionType.VIEW,
    );

    const starts = await this.repository.countByType(
      parkingId,
      ParkingInteractionType.START_SESSION,
    );

    const extensions = await this.repository.countByType(
      parkingId,
      ParkingInteractionType.EXTEND_SESSION,
    );

    const conversionRate = views === 0 ? 0 : starts / views;
    const extensionRate = starts === 0 ? 0 : extensions / starts;

    const score = Math.round(
      conversionRate * 70 + extensionRate * 30,
    );

    return {
      parkingId,
      views,
      starts,
      extensions,
      conversionRate: Number(conversionRate.toFixed(2)),
      extensionRate: Number(extensionRate.toFixed(2)),
      score,
    };
  }
}