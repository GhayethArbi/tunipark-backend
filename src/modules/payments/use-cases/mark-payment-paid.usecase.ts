import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class MarkPaymentPaidUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  execute(id: string, providerReference?: string) {
    return this.repo.markPaid(id, providerReference);
  }
}
