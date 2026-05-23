import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class GetPaymentByIdUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  async execute(id: string) {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Payment not found');
    return p;
  }
}
