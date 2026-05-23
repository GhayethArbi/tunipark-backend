import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & any>();
    const auth = req.headers?.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = auth.substring('Bearer '.length);

    try {
      const payload: any = this.jwt.verify(token);

      // ✅ Normalize user object (so controller always uses user.id)
      const userId = payload.sub ?? payload.id ?? payload.userId;

      if (!userId) {
        throw new UnauthorizedException('Invalid token payload: missing user id');
      }

      req.user = {
        id: userId,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
