import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingSessionRepository } from '../repositories/parking-session.repository';

@Injectable()
export class GetParkingSessionUseCase {
  constructor(private readonly repo: ParkingSessionRepository) {}

  async execute(id: string) {
    const s = await this.repo.findById(id);
    if (!s) throw new NotFoundException('Session not found to get');
    return s;
  }
}
