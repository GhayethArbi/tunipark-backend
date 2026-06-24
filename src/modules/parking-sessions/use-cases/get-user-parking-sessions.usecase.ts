import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';
import { ParkingSessionEntity } from '../domain/parking-session.entity';

@Injectable()
export class GetUserParkingSessionsUseCase {
  constructor(
    private readonly parkingSessionRepository: ParkingSessionRepository,
  ) {}

  async execute(userId: string) {
    return this.parkingSessionRepository.findByUserId(userId);
  }
}