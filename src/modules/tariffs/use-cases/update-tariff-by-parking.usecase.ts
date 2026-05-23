import { Injectable } from '@nestjs/common';
import { Tariff } from '@prisma/client';
import { UpdateTariffDto } from '../dto/update-tariff.dto';
import { TariffRepository } from '../repositories/tariff.repository';

@Injectable()
export class UpdateTariffByParkingUseCase {
  constructor(private readonly tariffRepository: TariffRepository) {}

  async execute(
    ownerId: string,
    parkingId: string,
    dto: UpdateTariffDto,
  ): Promise<Tariff> {
    return this.tariffRepository.updateByParkingId(
      parkingId,
      ownerId,
      dto,
    );
  }
}