import { Injectable } from '@nestjs/common';
import { TariffRepository } from '../repositories/tariff.repository';

@Injectable()
export class CreateTariffUseCase {
  constructor(private readonly repo: TariffRepository) {}

  execute(ownerId: string, input: any) {
    return this.repo.create({ ...input, ownerId });
  }
}
