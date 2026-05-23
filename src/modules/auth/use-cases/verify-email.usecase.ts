import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { USER_REPO, UserRepo } from '../../users/repositories/user.repo';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPO) private readonly users: UserRepo,
  ) { }

  async execute(token: string): Promise<void> {
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);
      const email = decoded['email'];
      const user = await this.users.findByEmail(email);
      if (!user) throw new NotFoundException();
      const updatedUser = user.copyWith({ isEmailVerified: true, });
      await this.users.save(updatedUser);

    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      throw new UnauthorizedException('TOKEN_INVALID');
    }

  }
}