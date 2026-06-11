import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';
import { LogParkingInteractionUseCase } from 'src/modules/parking-interaction/use-cases/log-parking-interaction.use-case';
import { ParkingInteractionType } from 'src/modules/parking-interaction/domain/parking-interaction-type.enum';

@Injectable()
export class ExtendParkingSessionUseCase {
  constructor(
    private readonly parkingSessionRepository: ParkingSessionRepository,

    private readonly logParkingInteractionUseCase: LogParkingInteractionUseCase,
  ) {}

  async execute(input: {
    userId: string;
    sessionId: string;
    additionalMinutes: number;
  }) {
    const session = await this.parkingSessionRepository.findById(input.sessionId);

    if (!session) {
      throw new NotFoundException('Parking session not found');
    }

    if (session.userId !== input.userId) {
      throw new BadRequestException('You are not allowed to extend this session');
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Only active sessions can be extended');
    }

    if (input.additionalMinutes <= 0) {
      throw new BadRequestException('Additional minutes must be greater than 0');
    }

    const currentEndTime = session.endTime ?? new Date();

    const newEndTime = new Date(
      currentEndTime.getTime() + input.additionalMinutes * 60 * 1000,
    );

    const updatedSession = await this.parkingSessionRepository.updateEndTime(
      session.id,
      newEndTime,
    );

    await this.logParkingInteractionUseCase.execute({
      userId: input.userId,
      parkingId: session.parkingId,
      interactionType: ParkingInteractionType.EXTEND_SESSION,
    });

    return updatedSession;
  }
}