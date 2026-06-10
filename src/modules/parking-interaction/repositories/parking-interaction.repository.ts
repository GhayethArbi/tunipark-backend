import { ParkingInteractionType } from "../domain/parking-interaction-type.enum";

export const PARKING_INTERACTION_REPOSITORY =
  Symbol('PARKING_INTERACTION_REPOSITORY');

export interface ParkingInteractionRepository {
  create(data: {
    userId: string;
    parkingId: string;
    interactionType: ParkingInteractionType;
  }): Promise<void>;

  countRecentViews(parkingId: string, minutes: number): Promise<number>;
}