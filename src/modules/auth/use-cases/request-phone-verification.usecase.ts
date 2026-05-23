import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { UserRepo } from 'src/modules/users/repositories/user.repo';
import { SmsService } from 'src/common/sms/sms.service';

@Injectable()
export class RequestPhoneVerificationUseCase {
  constructor(
    @Inject('USER_REPO') private readonly users: UserRepo,
    private readonly otp: OtpService,
    private readonly sms: SmsService,
    // private readonly sms: SmsService, // later
  ) { }

  async execute(phoneNumber: string): Promise<{ message: string }> {
    const user = await this.users.findByPhone(phoneNumber);
    if (!user) throw new NotFoundException('User not found');

    const code = this.otp.generate6Digits();
    const codeHash = this.otp.hashOtp(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.users.updatePhoneOtp(user.id, codeHash, expiresAt);

    // TODO: send SMS with `code`
    // await this.sms.send(phoneNumber, `Your verification code is ${code}`);
    await this.sms.sendOtp(phoneNumber, code);

    console.log('[DEV OTP]', phoneNumber, code); // ✅ dev only

    return { message: 'OTP sent' };
  }
}
