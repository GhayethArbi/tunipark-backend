import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class EndParkingSessionUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  execute(id: string) {
    return this.repo.end(id);
  }
}
