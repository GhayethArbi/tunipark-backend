import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OtpService } from '../../services/otp.service';
import { TokenService } from '../../services/token.service';

@Injectable()
export class VerifyResetPhoneOtpUseCase {
  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
    private token: TokenService,
  ) {}

  async execute(phoneNumber: string, code: string) {
    const phone = phoneNumber.trim();

    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phone },
      select: {
        id: true,
        resetTokenVersion: true,
        phoneResetOtpHash: true,
        phoneResetOtpExpiresAt: true,
      },
    });

    if (!user?.phoneResetOtpHash || !user.phoneResetOtpExpiresAt) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.phoneResetOtpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    const incomingHash = this.otp.hashOtp(code);
    if (incomingHash !== user.phoneResetOtpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        phoneResetOtpHash: null,
        phoneResetOtpExpiresAt: null,
      },
    });

    const resetToken = this.token.signResetPasswordToken(user.id, user.resetTokenVersion);
    return { ok: true, token: resetToken };
  }
}
