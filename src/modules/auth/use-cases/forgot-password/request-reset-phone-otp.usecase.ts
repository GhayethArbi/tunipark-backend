import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SmsService } from 'src/common/sms/sms.service';
import { OtpService } from '../../services/otp.service';
import { UserRepo } from 'src/modules/users/repositories/user.repo';

@Injectable()
export class RequestResetPhoneOtpUseCase {


  constructor(
    @Inject('USER_REPO') private readonly users: UserRepo,
    private sms: SmsService,
    private otp: OtpService,
  ) { }

  async execute(phoneNumber: string) {
    const user = await this.users.findByPhone(phoneNumber);
    if (!user) throw new NotFoundException('User not found');
    //if (!user) return { ok: true };

    const code = this.otp.generate6Digits();
    const codeHash = this.otp.hashOtp(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.users.updatePhoneResetOtp(user.id, codeHash, expiresAt);
    

    // TODO: send SMS with `code`
    // await this.sms.send(phoneNumber, `Your verification code is ${code}`);
    //await this.sms.sendOtp(phone, code);
    console.log('[DEV OTP]', phoneNumber, code); // ✅ dev only

    return { ok: true };
  }
}
