import { Inject, Injectable } from '@nestjs/common';
import { ParkingStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  PARKING_INTERACTION_REPOSITORY,
  ParkingInteractionRepository,
} from 'src/modules/parking-interaction/repositories/parking-interaction.repository';
import { ParkingInteractionType } from 'src/modules/parking-interaction/domain/parking-interaction-type.enum';

@Injectable()
export class GetRecommendedParkingsUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(PARKING_INTERACTION_REPOSITORY)
    private readonly interactionRepository: ParkingInteractionRepository,
  ) {}

  async execute() {
    const parkings = await this.prisma.parking.findMany({
      where: {
        status: ParkingStatus.ACTIVE,
        archivedAt: null,
      },
      include: {
        tariff: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const result = await Promise.all(
      parkings.map(async (parking) => {
        const views = await this.interactionRepository.countByType(
          parking.id,
          ParkingInteractionType.VIEW,
        );

        const starts = await this.interactionRepository.countByType(
          parking.id,
          ParkingInteractionType.START_SESSION,
        );

        const extensions = await this.interactionRepository.countByType(
          parking.id,
          ParkingInteractionType.EXTEND_SESSION,
        );

        const conversionRate = views === 0 ? 0 : Math.min(starts / views, 1);
        const extensionRate = starts === 0 ? 0 : Math.min(extensions / starts, 1);

        const availabilityScore =
          parking.availablePlaces > 0
            ? Math.min(parking.availablePlaces / parking.maxPlaces, 1)
            : 0;

        const behavioralScore =
          conversionRate * 70 + extensionRate * 30;

        const finalScore = Math.round(
          behavioralScore * 0.7 + availabilityScore * 100 * 0.3,
        );

        return {
          ...parking,
          ai: {
            views,
            starts,
            extensions,
            conversionRate: Number(conversionRate.toFixed(2)),
            extensionRate: Number(extensionRate.toFixed(2)),
            availabilityScore: Number(availabilityScore.toFixed(2)),
            score: finalScore,
            recommendation:
              finalScore >= 70
                ? 'HIGHLY_RECOMMENDED'
                : finalScore >= 40
                  ? 'RECOMMENDED'
                  : 'LOW_PRIORITY',
          },
        };
      }),
    );

    return result.sort((a, b) => b.ai.score - a.ai.score);
  }
}