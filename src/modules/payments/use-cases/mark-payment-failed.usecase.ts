import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class MarkPaymentFailedUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  execute(id: string, providerReference?: string) {
    return this.repo.markFailed(id, providerReference);
  }
}
