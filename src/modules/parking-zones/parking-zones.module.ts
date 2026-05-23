import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ParkingZonesController } from './parking-zones.controller';
import { ParkingZoneRepository } from './repositories/parking-zone.repository';
import { PrismaParkingZoneRepository } from './repositories/prisma-parking-zone.repository';
import { CreateParkingZoneUseCase } from './use-cases/create-parking-zone.usecase';

@Module({
  controllers: [ParkingZonesController],
  providers: [
    PrismaService,
    CreateParkingZoneUseCase,
    { provide: ParkingZoneRepository, useClass: PrismaParkingZoneRepository },
  ],
  exports: [ParkingZoneRepository],
})
export class ParkingZonesModule {}
