import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ParkingSessionsController } from './parking-sessions.controller';

import { ParkingSessionRepository } from './repositories/parking-session.repository';
import { PrismaParkingSessionRepository } from './repositories/prisma-parking-session.repository';

import { CreateParkingSessionUseCase } from './use-cases/create-parking-session.usecase';
import { GetParkingSessionUseCase } from './use-cases/get-parking-session.usecase';
import { ListParkingSessionsUseCase } from './use-cases/list-parking-sessions.usecase';
import { ListActiveParkingSessionsUseCase } from './use-cases/list-active-parking-sessions.usecase';
import { ListSessionsByParkingUseCase } from './use-cases/list-sessions-by-parking.usecase';
import { EndParkingSessionUseCase } from './use-cases/end-parking-session.usecase';
import { CancelParkingSessionUseCase } from './use-cases/cancel-parking-session.usecase';
import { ParkingInteractionModule } from '../parking-interaction/parking-interaction.module';

@Module({
  imports: [
    ParkingInteractionModule,
  ],
  controllers: [ParkingSessionsController],
  providers: [
    PrismaService,

    { provide: ParkingSessionRepository, useClass: PrismaParkingSessionRepository },

    CreateParkingSessionUseCase,
    GetParkingSessionUseCase,
    ListParkingSessionsUseCase,
    ListActiveParkingSessionsUseCase,
    ListSessionsByParkingUseCase,
    EndParkingSessionUseCase,
    CancelParkingSessionUseCase,
  ],
  exports: [ParkingSessionRepository],
})
export class ParkingSessionsModule { }
