import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class GetPaymentBySessionUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  async execute(sessionId: string) {
    const p = await this.repo.findBySessionId(sessionId);
    if (!p) throw new NotFoundException('Payment not found for this session');
    return p;
  }
}
