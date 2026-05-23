import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPO, UserRepo } from '../../users/repositories/user.repo';
import { BcryptService } from '../../../common/services/bcrypt.service';
import { TokenService } from '../services/token.service';
import { IdentifierService, IdentifierType } from '../services/identifier.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPO) private readonly users: UserRepo,
    private readonly bcrypt: BcryptService,
    private readonly tokens: TokenService,
    private readonly identifierService: IdentifierService,

  ) { }

  async execute(input: { identifier: string; password: string }) {
    const identifier = this.identifierService.normalize(input.identifier);
    const type = this.identifierService.detect(identifier);

    const user =
      type === IdentifierType.EMAIL
        ? await this.users.findByEmail(identifier)
        : await this.users.findByPhone(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.tokens.signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    console.log("access token gratend : " + accessToken + "\n user:" + user.email);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}
