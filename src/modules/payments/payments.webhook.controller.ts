import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlouciWebhookUseCase } from './use-cases/flouci-webhook.usecase';

@ApiTags('Payments Webhook')
@Controller('payments/webhook')
export class PaymentsWebhookController {
  constructor(private readonly flouciWebhookUC: FlouciWebhookUseCase) {}



  @Get('flouci')
async flouciGet(@Query() query: any) {
  console.log('✅ Flouci webhook GET received:', query);

  const token = query.token?.split('?')[0];
  const flouciPaymentId =
    query.payment_id ||
    query.paymentId ||
    query.id ||
    query.token?.split('payment_id=')[1];

  if (token !== process.env.FLOUCI_WEBHOOK_TOKEN) {
    throw new BadRequestException('Invalid webhook token');
  }

  if (!flouciPaymentId) {
    throw new BadRequestException('Missing payment_id');
  }

  return this.flouciWebhookUC.execute(flouciPaymentId);
}

  @Post('flouci')
  @ApiOperation({ summary: 'Flouci webhook (server-to-server)' })
  async flouci(@Query('token') token: string, @Body() body: any) {
    if (token !== process.env.FLOUCI_WEBHOOK_TOKEN) {
      throw new BadRequestException('Invalid webhook token');
    }

    const flouciPaymentId =
      body?.payment_id || body?.paymentId || body?.id || body?.result?.payment_id;

    if (!flouciPaymentId) {
      throw new BadRequestException('Missing payment_id in webhook payload');
    }

    return this.flouciWebhookUC.execute(flouciPaymentId);
  }
}
