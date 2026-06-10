import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LogParkingInteractionUseCase } from './use-cases/log-parking-interaction.use-case';
import { PARKING_INTERACTION_REPOSITORY } from './repositories/parking-interaction.repository';
import { ParkingInteractionPrismaRepository } from './repositories/parking-interaction-prisma.repository';


@Module({
  providers: [
    PrismaService,
    LogParkingInteractionUseCase,
    {
      provide: PARKING_INTERACTION_REPOSITORY,
      useClass: ParkingInteractionPrismaRepository,
    },
  ],
  exports: [LogParkingInteractionUseCase],
})
export class ParkingInteractionModule {}