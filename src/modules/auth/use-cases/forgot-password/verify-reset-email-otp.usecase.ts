import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { OtpService } from '../../services/otp.service';
import { TokenService } from '../../services/token.service';

@Injectable()
export class VerifyResetEmailOtpUseCase {
  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
    private token: TokenService,
  ) {}

  async execute(email: string, code: string) {
    const e = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: e } });

    if (!user?.emailResetOtpHash || !user.emailResetOtpExpiresAt) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.emailResetOtpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    const incomingHash = this.otp.hashOtp(code);
    if (incomingHash !== user.emailResetOtpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailResetOtpHash: null,
        emailResetOtpExpiresAt: null,
      },
    });

    const resetToken = this.token.signResetPasswordToken(user.id, user.resetTokenVersion);
    return { ok: true, token: resetToken };
  }
}
