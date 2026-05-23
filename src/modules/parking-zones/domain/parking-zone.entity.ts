export class ParkingZone {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly city: string,
    public readonly geometry: Record<string, any>, // GeoJSON or whatever you store
    public readonly auditorId: string,
    public readonly archivedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }
}
