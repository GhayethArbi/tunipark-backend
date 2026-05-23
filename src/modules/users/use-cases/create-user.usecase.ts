import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../domain/user-role.enum';
import { USER_REPO, UserRepo } from '../repositories/user.repo';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO) private readonly users: UserRepo) { }

  async execute(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: UserRole;
  }) {
    if (await this.users.findByEmail(input.email)) throw new ConflictException('Email already used');
    if (await this.users.findByPhone(input.phoneNumber)) throw new ConflictException('Phone number already used');

    const role = input.role ?? UserRole.USER;

    const user = await this.users.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: input.password,
      role,
      phoneOtpExpiresAt: null,
      phoneOtpHash: null

    });

    return user;
  }
}
