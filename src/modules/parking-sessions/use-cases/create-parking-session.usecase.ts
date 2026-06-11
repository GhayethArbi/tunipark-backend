import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';
import { LogParkingInteractionUseCase } from 'src/modules/parking-interaction/use-cases/log-parking-interaction.use-case';
import { ParkingInteractionType } from 'src/modules/parking-interaction/domain/parking-interaction-type.enum';
import { CreateParkingSessionDto } from '../dto/create-parking-session.dto';

@Injectable()
export class CreateParkingSessionUseCase {
  constructor(private readonly repo: ParkingSessionRepository,
    private readonly logParkingInteractionUseCase: LogParkingInteractionUseCase,
  ) { }

  async execute(_userId: string, dto: CreateParkingSessionDto) {
    await this.logParkingInteractionUseCase.execute({
      userId: _userId,
      parkingId: dto.parkingId,
      interactionType: ParkingInteractionType.START_SESSION,
    });
    console.log("creating parking session ...");
    return this.repo.create({ userId: _userId, ...dto });

  }
}
