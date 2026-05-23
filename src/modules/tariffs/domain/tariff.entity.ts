
export class Tariff {
  constructor(
    public readonly id: string,
    public readonly pricePerUnit: number | null,
    public readonly pricePerDay: number,
    public readonly pricePerMonth: number,
    public readonly minDuration: number | null,
    public readonly maxDuration: number | null,
    public readonly parkingId: string,
    public readonly archivedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }
}
