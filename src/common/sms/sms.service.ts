import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SmsProvider } from './sms.provider';
@Injectable()
export class SmsService {
    private readonly client: Twilio;
    private readonly logger = new Logger(SmsService.name);
    private readonly provider: SmsProvider;
    constructor() {
        console.log("sid : ", process.env.TWILIO_ACCOUNT_SID);
        console.log("token : ", process.env.TWILIO_AUTH_TOKEN);
        console.log("number : ", process.env.TWILIO_FROM);
        this.client = new Twilio(
            process.env.TWILIO_ACCOUNT_SID!,
            process.env.TWILIO_AUTH_TOKEN!,
        );
    }

    normalizePhoneNumber(input: string): string {
        return input.replace(/[^\d+]/g, '');
    }
    async sendOtp(phoneNumber: string, code: string): Promise<void> {
        const body = `Your verification code is ${code}. It expires in 10 minutes.`;
        const to = this.normalizePhoneNumber(phoneNumber);
        console.log("to : ", to);
        const msg = await this.client.messages.create({
            to: to,
            from: process.env.TWILIO_FROM!, // number or sender id (depends on country)
            body,
        });
        await this.provider.send(to, body);
        this.logger.log(`SMS queued: sid=${msg.sid} to=${phoneNumber}`);
    }
}
