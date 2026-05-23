import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { USER_REPO, UserRepo } from 'src/modules/users/repositories/user.repo';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(USER_REPO) private readonly users: UserRepo,

    private readonly tokens: TokenService,

  ) { }

  async execute(refreshToken: string) {
    try {
      const payload = this.tokens.verifyRefreshToken(refreshToken);

      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User no longer exists');

      const accessToken = this.tokens.signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = this.tokens.signRefreshToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
