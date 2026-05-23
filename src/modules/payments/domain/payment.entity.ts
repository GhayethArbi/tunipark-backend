import { PaymentStatus } from '@prisma/client';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly provider: string,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly providerReference: string | null,
    public readonly paidAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPaid() {
    return this.status === PaymentStatus.PAID;
  }

  isPending() {
    return this.status === PaymentStatus.PENDING;
  }
}
