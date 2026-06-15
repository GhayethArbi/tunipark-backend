import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParkingsController } from './parkings.controller';
import { ParkingRepository } from './repositories/parking.repository';
import { PrismaParkingRepository } from './repositories/prisma-parking.repository';
import { CreateParkingUseCase } from './use-cases/create-parking.usecase';
import { AdminParkingsController } from './admin-parkings.controller';
import { GetRecommendedParkingsUseCase } from './use-cases/get-recommended-parkings.use-case';
import { ParkingInteractionModule } from '../parking-interaction/parking-interaction.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    ParkingInteractionModule, AiModule,
  ],
  controllers: [ParkingsController, AdminParkingsController],
  providers: [
    GetRecommendedParkingsUseCase,
    PrismaService,
    CreateParkingUseCase,
    { provide: ParkingRepository, useClass: PrismaParkingRepository },
  ],
})
export class ParkingsModule { }
