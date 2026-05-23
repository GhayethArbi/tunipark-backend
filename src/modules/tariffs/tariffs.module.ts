import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TariffsController } from './tariffs.controller';
import { TariffRepository } from './repositories/tariff.repository';
import { PrismaTariffRepository } from './repositories/prisma-tariff.repository';
import { CreateTariffUseCase } from './use-cases/create-tariff.usecase';
import { UpdateTariffByParkingUseCase } from './use-cases/update-tariff-by-parking.usecase';

@Module({
  controllers: [TariffsController],
  providers: [
    PrismaService,
    CreateTariffUseCase,
    UpdateTariffByParkingUseCase,
    { provide: TariffRepository, useClass: PrismaTariffRepository },
  ],
})
export class TariffsModule {}
