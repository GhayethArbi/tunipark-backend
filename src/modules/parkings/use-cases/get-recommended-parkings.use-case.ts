import { Inject, Injectable } from '@nestjs/common';
import { ParkingStatus } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  PARKING_INTERACTION_REPOSITORY,
  ParkingInteractionRepository,
} from 'src/modules/parking-interaction/repositories/parking-interaction.repository';
import { ParkingInteractionType } from 'src/modules/parking-interaction/domain/parking-interaction-type.enum';
import { AiService } from 'src/modules/ai/ai.service';

@Injectable()
export class GetRecommendedParkingsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,

    @Inject(PARKING_INTERACTION_REPOSITORY)
    private readonly interactionRepository: ParkingInteractionRepository,
  ) { }

  async execute(input: { lat: number; lng: number }) {
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
        const extensionRate =
          starts === 0 ? 0 : Math.min(extensions / starts, 1);

        const availabilityScore =
          parking.availablePlaces > 0 && parking.maxPlaces > 0
            ? Math.min(parking.availablePlaces / parking.maxPlaces, 1)
            : 0;

        const parkingCoords = this.extractCoordinates(parking.location);

        const distanceKm = parkingCoords
          ? this.calculateDistanceKm(
            input.lat,
            input.lng,
            parkingCoords.lat,
            parkingCoords.lng,
          )
          : 999;

        const behaviorScore = conversionRate * 0.7 + extensionRate * 0.3;

        const price =
          parking.tariff?.pricePerMonth ??
          parking.tariff?.pricePerDay ??
          parking.tariff?.pricePerUnit ??
          0;

        const aiPrediction = await this.aiService.predict({
          distanceKm,
          availabilityScore,
          conversionRate,
          extensionRate,
          price,
        });

        return {
          ...parking,
          ai: {
            views,
            starts,
            extensions,
            distanceKm: Number(distanceKm.toFixed(2)),
            conversionRate: Number(conversionRate.toFixed(2)),
            extensionRate: Number(extensionRate.toFixed(2)),
            availabilityScore: Number(availabilityScore.toFixed(2)),
            behaviorScore: Number(behaviorScore.toFixed(2)),
            price,
            score: aiPrediction.score,
            recommendation: aiPrediction.recommendation,
            source: 'ML_RANDOM_FOREST',
          },
        };
      }),
    );

    return result.sort((a, b) => b.ai.score - a.ai.score);
  }

  private extractCoordinates(location: any): { lat: number; lng: number } | null {
    if (!location) return null;

    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      return { lat: location.lat, lng: location.lng };
    }

    if (
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number'
    ) {
      return { lat: location.latitude, lng: location.longitude };
    }

    if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      return {
        lng: Number(location.coordinates[0]),
        lat: Number(location.coordinates[1]),
      };
    }

    return null;
  }

  private calculateDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const earthRadiusKm = 6371;

    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}