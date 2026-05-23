import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';

@Injectable()
export class OtpThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: any): Promise<string> {
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      'unknown-ip';

    const phone = req.body?.phoneNumber || req.query?.phoneNumber;
    console.log("phone number guard : ", phone);
    return phone ? `${ip}|phone:${phone}` : ip;
  }

  protected generateKey(context: ExecutionContext, tracker: string, throttlerName: string): string {
    return `${throttlerName}:${tracker}`;
  }
}
