import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaymentRepository } from './payment.repository';
import { PaymentStatus, SessionStatus } from '@prisma/client';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any) {
        console.log("PrismaPaymentRepository create i m in ");
        // session must exist and not archived
        const session = await this.prisma.parkingSession.findFirst({
            where: { id: data.sessionId, archivedAt: null },
        });
        console.log("PrismaPaymentRepository create i m in 2");

        if (!session) throw new NotFoundException('Session not found to create');
        console.log("PrismaPaymentRepository create i m in 3");

        // // optional rule: don't allow payment if session cancelled
        // if (session.status === SessionStatus.CANCELLED) {
        //     throw new BadRequestException('Cannot pay a cancelled session');
        // }
        console.log("PrismaPaymentRepository create i m in 4");

        // 1–1 payment
        const existing = await this.prisma.payment.findFirst({
            where: { sessionId: data.sessionId, archivedAt: null },
        });
        console.log("PrismaPaymentRepository create i m in 5");

        if (existing) throw new ConflictException('Payment already exists for this session');
        console.log("PrismaPaymentRepository create i m in 6");

        return this.prisma.payment.create({
            data: {
                provider: data.provider,
                amount: data.amount,
                status: PaymentStatus.PENDING,
                providerReference: data.providerReference ?? null,
                session: { connect: { id: data.sessionId } },
            },
        });
    }

    findById(id: string) {
        return this.prisma.payment.findFirst({
            where: { id, archivedAt: null },
        });
    }

    findBySessionId(sessionId: string) {
        return this.prisma.payment.findFirst({
            where: { sessionId, archivedAt: null },
        });
    }

    listAll() {
        return this.prisma.payment.findMany({
            where: { archivedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markPaid(id: string, providerReference?: string) {
        const payment = await this.findById(id);
        if (!payment) throw new NotFoundException('Payment not found');

        if (payment.status === PaymentStatus.PAID) return payment;

        const updated = await this.prisma.payment.update({
            where: { id },
            data: {
                status: PaymentStatus.PAID,
                paidAt: new Date(),
                providerReference: providerReference ?? payment.providerReference,
            },
        });

        // optional: when paid -> mark session expired/ended if it has no endTime
        await this.prisma.parkingSession.update({
            where: { id: updated.sessionId },
            data: {
                paidDuration: { increment: 0 }, // keep for later logic
            },
        });

        return updated;
    }

    async markFailed(id: string, providerReference?: string) {
        const payment = await this.findById(id);
        if (!payment) throw new NotFoundException('Payment not found');

        if (payment.status === PaymentStatus.FAILED) return payment;

        return this.prisma.payment.update({
            where: { id },
            data: {
                status: PaymentStatus.FAILED,
                providerReference: providerReference ?? payment.providerReference,
            },
        });
    }

    findByProviderReference(providerReference: string) {
        return this.prisma.payment.findFirst({
            where: { providerReference, archivedAt: null },
        });
    }
    updateProviderReference(id: string, providerReference: string) {
        return this.prisma.payment.update({
            where: { id },
            data: { providerReference },
        });
    }

}
