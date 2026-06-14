import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { FlouciService } from '../providers/flouci/flouci.service';
import { ParkingSessionRepository } from 'src/modules/parking-sessions/repositories/parking-session.repository';
import { LogParkingInteractionUseCase } from 'src/modules/parking-interaction/use-cases/log-parking-interaction.use-case';
import { ParkingInteractionType } from 'src/modules/parking-interaction/domain/parking-interaction-type.enum';

@Injectable()
export class FlouciWebhookUseCase {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly flouci: FlouciService,
    private readonly parkingSessions: ParkingSessionRepository,
    private readonly logParkingInteractionUseCase: LogParkingInteractionUseCase,
  ) { }

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
      const paidPayment = await this.payments.markPaid(
        payment.id,
        paymentIdFromProvider,
      );

      const session = await this.parkingSessions.activate(payment.sessionId);

      if (session.userId) {
        await this.logParkingInteractionUseCase.execute({
          userId: session.userId,
          parkingId: session.parkingId,
          interactionType: ParkingInteractionType.START_SESSION,
        });
      }

      return {
        payment: paidPayment,
        session,
      };
    }

    if (st === 'FAILURE' || st === 'EXPIRED') {
      return this.payments.markFailed(payment.id, paymentIdFromProvider);
    }

    return { ok: true, status: 'PENDING' };
  }
}
