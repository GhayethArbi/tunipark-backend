import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) { }

  signAccessToken(payload: { sub: string; email: string; role: string }) {
    return this.jwt.sign(payload, { expiresIn: '1h' });
  }

  signRefreshToken(payload: { sub: string; email: string; role: string }) {
    return this.jwt.sign(payload, {
      expiresIn: '48h',
    });
  }

  signResetPasswordToken(userId: string, version: number) {
    return this.jwt.sign(
      { sub: userId, type: 'RESET_PASSWORD', v: version },
      { expiresIn: '15m' },
    );
  }

  verifyResetPasswordToken(token: string): { userId: string; version: number } {
    const payload = this.jwt.verify(token) as any;
    if (payload.type !== 'RESET_PASSWORD') throw new Error('Invalid token type');
    return { userId: payload.sub, version: payload.v };
  }
  verifyRefreshToken(token: string): {
  sub: string;
  email: string;
  role: string;
} {
  return this.jwt.verify(token) as {
    sub: string;
    email: string;
    role: string;
  };
}
}
