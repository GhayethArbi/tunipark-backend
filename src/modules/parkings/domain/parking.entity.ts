import { ParkingVehicleType } from './parking-vehicle-type.enum';
import { AccessMode, ParkingStatus, ParkingSpotType, ParkingType } from './parking.enums';

export class Parking {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly type: ParkingType,
    public readonly spotType: ParkingSpotType,
    public readonly description: string,
// caractéristiques: example ["camera", "covered", "guarded"]
    public readonly characteristics: string[],
    // minimum 3 pictures should be validated in DTO
    public readonly pictures: string[],

        // NEW
    public readonly maxPlaces: number,
    public readonly availablePlaces: number,

    // NEW
    public readonly openingTime: string,
    public readonly closingTime: string,

    // NEW
    public readonly vehicleTypes: ParkingVehicleType[],
    public readonly location: Record<string, any>,
    public readonly status: ParkingStatus,
    public readonly accessMode: AccessMode,
    public readonly zoneId: string | null,
    public readonly ownerId: string,
    public readonly archivedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }
}
