import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  execute(dto: any) {
    return this.repo.create(dto);
  }
}
