import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsProvider } from './sms.provider';

@Injectable()
export class LocalSmsProvider implements SmsProvider {
  private readonly logger = new Logger(LocalSmsProvider.name);

  constructor(private readonly config: ConfigService) {}

  async send(to: string, message: string): Promise<{ providerMessageId?: string }> {
    const baseUrl = this.config.get<string>('SMS_GATEWAY_BASE_URL')!;
    const apiKey = this.config.get<string>('SMS_GATEWAY_API_KEY')!;
    const sender = this.config.get<string>('SMS_SENDER')!; // e.g. "REDSYS"

    // ✅ Example payload (you will adapt to your provider’s docs)
    const payload = {
      to,
      message,
      sender,
    };

    const res = await fetch(`${baseUrl}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`, // some gateways use x-api-key instead
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      this.logger.error(`SMS gateway error ${res.status}: ${JSON.stringify(data)}`);
      throw new Error('SMS provider failed');
    }

    // adapt to provider response
    return { providerMessageId: data?.messageId ?? data?.id };
  }
}
