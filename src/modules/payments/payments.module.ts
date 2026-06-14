import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaymentsController } from './payments.controller';

import { PaymentRepository } from './repositories/payment.repository';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';

import { CreatePaymentUseCase } from './use-cases/create-payment.usecase';
import { MarkPaymentPaidUseCase } from './use-cases/mark-payment-paid.usecase';
import { MarkPaymentFailedUseCase } from './use-cases/mark-payment-failed.usecase';
import { GetPaymentByIdUseCase } from './use-cases/get-payment-by-id.usecase';
import { GetPaymentBySessionUseCase } from './use-cases/get-payment-by-session.usecase';
import { ListPaymentsUseCase } from './use-cases/list-payments.usecase';
import { PaymentsWebhookController } from './payments.webhook.controller';
import { FlouciService } from './providers/flouci/flouci.service';
import { FlouciWebhookUseCase } from './use-cases/flouci-webhook.usecase';
import { InitFlouciPaymentUseCase } from './use-cases/init-flouci-payment.usecase';
import { ParkingInteractionModule } from '../parking-interaction/parking-interaction.module';
import { ParkingSessionsModule } from '../parking-sessions/parking-sessions.module';

@Module({
    imports: [
        ParkingSessionsModule,
        ParkingInteractionModule,
    ],
    controllers: [PaymentsController, PaymentsWebhookController],
    providers: [
        PrismaService, FlouciService,
        { provide: PaymentRepository, useClass: PrismaPaymentRepository },

        CreatePaymentUseCase,
        MarkPaymentPaidUseCase,
        MarkPaymentFailedUseCase,
        GetPaymentByIdUseCase,
        GetPaymentBySessionUseCase,
        ListPaymentsUseCase,
        InitFlouciPaymentUseCase,
        FlouciWebhookUseCase,
    ],
})
export class PaymentsModule { }
