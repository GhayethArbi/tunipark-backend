import { Injectable } from '@nestjs/common';
import { ParkingZoneRepository } from '../repositories/parking-zone.repository';

@Injectable()
export class CreateParkingZoneUseCase {
  constructor(private readonly repo: ParkingZoneRepository) { }

  execute(auditorId: string, input: { name: string; city: string; geometry: any }) {
    return this.repo.create({ ...input, auditorId });
  }
}
