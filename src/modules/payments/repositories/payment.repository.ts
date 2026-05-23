import { Payment } from '@prisma/client';

export abstract class PaymentRepository {
    abstract create(data: {
        sessionId: string;
        provider: string;
        amount: number;
        providerReference?: string;
    }): Promise<Payment>;

    abstract findById(id: string): Promise<Payment | null>;
    abstract findBySessionId(sessionId: string): Promise<Payment | null>;
    abstract listAll(): Promise<Payment[]>;

    abstract markPaid(id: string, providerReference?: string): Promise<Payment>;
    abstract markFailed(id: string, providerReference?: string): Promise<Payment>;
    abstract findByProviderReference(providerReference: string): Promise<any | null>;
    abstract updateProviderReference(id: string, providerReference: string): Promise<any>;

}
