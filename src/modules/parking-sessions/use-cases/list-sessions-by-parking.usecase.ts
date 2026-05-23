import { Injectable } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class ListSessionsByParkingUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  execute(parkingId: string) {
    return this.repo.listByParking(parkingId);
  }
}
