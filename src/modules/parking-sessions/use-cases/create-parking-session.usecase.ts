import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class CreateParkingSessionUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  execute(_userId: string, dto: any) {
    // userId is available if you want ownership/audit later
    return this.repo.create(dto);
  }
}
