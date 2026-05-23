import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FlouciService {
  private readonly baseUrl =
    process.env.FLOUCI_BASE_URL || 'https://developers.flouci.com/api/v2';

  private authHeader(): string {
    const pub = process.env.FLOUCI_PUBLIC_KEY;
    const priv = process.env.FLOUCI_PRIVATE_KEY;
    if (!pub || !priv) {
      throw new BadRequestException('Missing Flouci keys in env');
    }
    return `Bearer ${pub}:${priv}`;
  }

  async generatePayment(input: {
    amount: number;
    successUrl: string;
    failUrl: string;
    webhookUrl: string;
    developerTrackingId: string;
  }) {
    console.log("generate pay ....1");
    const payload = {
      amount: input.amount,
      accept_card: true,
      session_timeout_secs: 1200,
      success_link: input.successUrl,
      fail_link: input.failUrl,
      developer_tracking_id: input.developerTrackingId,
      webhook: input.webhookUrl,
    };
    console.log("generate pay ....2");

    const res = await fetch(`${this.baseUrl}/generate_payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader(),
      },
      body: JSON.stringify(payload),
    });
    console.log("generate pay ....3");

    // ✅ Best debug
    const raw = await res.text();
    let json: any = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = raw;
    }

    if (!res.ok) {
      throw new BadRequestException(
        `Flouci generate_payment failed: ${res.status} ${JSON.stringify(json)}`,
      );
    }

    return json as {
      result: {
        success: boolean;
        payment_id: string;
        link: string;
        developer_tracking_id?: string;
      };
      success: boolean;
    };
  }

  async verifyPayment(paymentId: string) {
    const res = await fetch(`${this.baseUrl}/verify_payment/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: this.authHeader(),
      },
    });

    const raw = await res.text();
    let json: any = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = raw;
    }

    if (!res.ok) {
      throw new BadRequestException(
        `Flouci verify_payment failed: ${res.status} ${JSON.stringify(json)}`,
      );
    }

    return json as {
      success: boolean;
      result?: {
        status: 'SUCCESS' | 'PENDING' | 'EXPIRED' | 'FAILURE';
        amount: number;
        developer_tracking_id?: string;
        is_test_transaction?: boolean;
      };
    };
  }
}
