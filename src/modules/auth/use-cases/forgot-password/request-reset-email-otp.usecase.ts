import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MailService } from 'src/common/mail/mail.service';
import { OtpService } from '../../services/otp.service';

@Injectable()
export class RequestResetEmailOtpUseCase {
  private OTP_MINUTES = 10;

  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
    private mail: MailService,
  ) {}

  async execute(email: string) {
    const e = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: e } });

    if (!user) return { ok: true };

    const code = this.otp.generate6Digits();
    const codeHash = this.otp.hashOtp(code);
    const expiresAt = new Date(Date.now() + this.OTP_MINUTES * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        emailResetOtpHash: codeHash,
        emailResetOtpExpiresAt: expiresAt,
      },
    });

    await this.mail.sendOtp(e, code);

    return { ok: true };
  }
}
