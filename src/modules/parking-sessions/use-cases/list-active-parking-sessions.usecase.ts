import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class ListActiveParkingSessionsUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  execute() {
    return this.repo.listActive();
  }
}
