import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class CancelParkingSessionUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  execute(id: string) {
    return this.repo.cancel(id);
  }
}
