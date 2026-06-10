import { ParkingInteractionType } from "./parking-interaction-type.enum";

export class ParkingInteractionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly parkingId: string,
    public readonly interactionType: ParkingInteractionType,
    public readonly createdAt: Date,
  ) {}
}
