import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPO, UserRepo } from '../repositories/user.repo';

@Injectable()
export class GetUserByIdUseCase {
  constructor(@Inject(USER_REPO) private readonly users: UserRepo) { }

  async execute(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}