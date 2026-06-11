import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LogParkingInteractionUseCase } from './use-cases/log-parking-interaction.use-case';
import { PARKING_INTERACTION_REPOSITORY } from './repositories/parking-interaction.repository';
import { ParkingInteractionPrismaRepository } from './repositories/parking-interaction-prisma.repository';
import { ParkingInteractionController } from './parking-interaction-controller';
import { FindParkingInteractionsUseCase } from './use-cases/find-parking-interactions.use-case';

@Module({
  controllers: [ParkingInteractionController],
  providers: [
    PrismaService,
    LogParkingInteractionUseCase,
    FindParkingInteractionsUseCase,
    {
      provide: PARKING_INTERACTION_REPOSITORY,
      useClass: ParkingInteractionPrismaRepository,
    },
  ],
  exports: [LogParkingInteractionUseCase, FindParkingInteractionsUseCase],
})
export class ParkingInteractionModule {}