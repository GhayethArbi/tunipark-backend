import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { BcryptService } from '../../../../common/services/bcrypt.service';
import { TokenService } from '../../services/token.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
    private token: TokenService,
  ) {}

  async execute(resetToken: string, newPassword: string) {
    let parsed: { userId: string; version: number };

    try {
      parsed = this.token.verifyResetPasswordToken(resetToken);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: parsed.userId } });
    if (!user) throw new BadRequestException('Invalid token');


    if (user.resetTokenVersion !== parsed.version) {
      throw new BadRequestException('Token expired');
    }

    const hashed = await this.bcrypt.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetTokenVersion: { increment: 1 },
      },
    });

    return { ok: true };
  }
}
