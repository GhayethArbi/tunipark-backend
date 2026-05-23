import { Tariff } from '@prisma/client';

export abstract class TariffRepository {
  abstract create(data: {
    pricePerUnit: number;
    pricePerDay: number;
    pricePerMonth: number;
    minDuration: number;
    maxDuration: number;
    parkingId: string;
    ownerId: string;
  }): Promise<Tariff>;

  abstract update(id: string, ownerId: string, data: Partial<{
    pricePerUnit: number;
    pricePerDay: number;
    pricePerMonth: number;
    minDuration: number;
    maxDuration: number;
  }>): Promise<Tariff>;
   abstract updateByParkingId(
    parkingId: string,
    ownerId: string,
    data: Partial<{
      pricePerUnit: number;
      pricePerDay: number;
      pricePerMonth: number;
      minDuration: number;
      maxDuration: number;
    }>,
  ): Promise<Tariff>;
  abstract findByParkingId(parkingId: string, ownerId: string): Promise<Tariff | null>;

  abstract archive(id: string, ownerId: string): Promise<Tariff>;
}
