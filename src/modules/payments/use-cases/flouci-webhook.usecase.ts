import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { FlouciService } from '../providers/flouci/flouci.service';

@Injectable()
export class FlouciWebhookUseCase {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly flouci: FlouciService,
  ) {}

  async execute(paymentIdFromProvider: string) {
    const verified = await this.flouci.verifyPayment(paymentIdFromProvider);
    if (!verified.success || !verified.result) {
      throw new BadRequestException('Verify response invalid');
    }

    // Find local payment by providerReference (payment_id)
    const payment = await this.payments.findByProviderReference(paymentIdFromProvider);
    if (!payment) throw new NotFoundException('Local payment not found');

    const st = verified.result.status;
    if (st === 'SUCCESS') {
      return this.payments.markPaid(payment.id, paymentIdFromProvider);
    }
    if (st === 'FAILURE' || st === 'EXPIRED') {
      return this.payments.markFailed(payment.id, paymentIdFromProvider);
    }

    return { ok: true, status: 'PENDING' };
  }
}
