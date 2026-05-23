import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OtpService } from '../services/otp.service';
import { UserRepo } from 'src/modules/users/repositories/user.repo';

@Injectable()
export class VerifyPhoneOtpUseCase {
  constructor(
    @Inject('USER_REPO') private readonly users: UserRepo,
    private readonly prisma: PrismaService,
    private readonly otp: OtpService,
  ) { }

  async execute(phoneNumber: string, code: string): Promise<{ message: string }> {
    const user = await this.users.findByPhone(phoneNumber);
    if (!user) throw new NotFoundException('User not found');

    const dbUser = await this.users.findById(user.id);
    if (!dbUser?.phoneOtpHash || !dbUser.phoneOtpExpiresAt) {
      throw new UnauthorizedException('No OTP requested');
    }

    if (new Date() > dbUser.phoneOtpExpiresAt) {
      throw new UnauthorizedException('OTP expired');
    }

    const hash = this.otp.hashOtp(code);
    if (hash !== dbUser.phoneOtpHash) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const updated = user.copyWith({ isPhoneNumberVerified: true, phoneOtpHash: null, phoneOtpExpiresAt: null });
    await this.users.save(updated);

    await this.users.updatePhoneOtp(user.id, null, null);

    return { message: 'Phone number verified' };
  }
}
