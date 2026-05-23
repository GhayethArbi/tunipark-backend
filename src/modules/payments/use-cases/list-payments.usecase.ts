import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class ListPaymentsUseCase {
  constructor(private readonly repo: PaymentRepository) {}

  execute() {
    return this.repo.listAll();
  }
}
