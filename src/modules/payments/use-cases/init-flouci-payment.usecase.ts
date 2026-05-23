import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { FlouciService } from '../providers/flouci/flouci.service';

@Injectable()
export class InitFlouciPaymentUseCase {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly flouci: FlouciService,
  ) { }

  async execute(sessionId: string) {
    // 1) You can compute amount from session/tariff later.
    // For now we assume amount is stored somewhere or fixed.
    // Recommended: compute amount based on TariffCalculator.

    console.log("init/flouci i m in");
    console.log("you dto init flouci is :" + sessionId);
    const amount = 1200;
    console.log("let s check use case11");

    const apiUrl = process.env.API_PUBLIC_URL;
    if (!apiUrl) throw new BadRequestException('Missing API_PUBLIC_URL');
    console.log("let s check use case12");

    // 2) Create local payment in DB as PENDING (no providerReference yet)
    const localPayment = await this.payments.create({
      sessionId,
      provider: 'flouci',
      amount,
      providerReference: undefined,
    });
    console.log("let s check use case13");

    // 3) Generate provider payment
    const webhookUrl = `${apiUrl}/payments/webhook/flouci?token=${process.env.FLOUCI_WEBHOOK_TOKEN}`;
    // const successUrl = `${apiUrl}/success?paymentId=${localPayment.id}`;
    // const failUrl = `${apiUrl}/fail?paymentId=${localPayment.id}`;
    const successUrl = `${apiUrl}/payments/redirect/success?paymentId=${localPayment.id}`;
    const failUrl = `${apiUrl}/payments/redirect/fail?paymentId=${localPayment.id}`;
    console.log("let s check use case14");

    const generated = await this.flouci.generatePayment({
      amount,
      successUrl,
      failUrl,
      webhookUrl,
      developerTrackingId: localPayment.id, // ✅ link provider ↔ your payment
    });
    console.log("let s check use case15");

    if (!generated?.result?.success || !generated?.result?.payment_id || !generated?.result?.link) {
      throw new BadRequestException('Invalid Flouci response');
    }
    console.log("let s check use case2");

    // 4) Save providerReference = payment_id
    const updated = await this.payments.updateProviderReference(localPayment.id, generated.result.payment_id);
    console.log("let s check use case3");
    return {
      paymentId: updated.id,
      provider: 'flouci',
      amount: updated.amount,
      flouciPaymentId: generated.result.payment_id,
      payLink: generated.result.link,
    };
  }
}
