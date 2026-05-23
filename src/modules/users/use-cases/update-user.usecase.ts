import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPO, UserRepo } from '../repositories/user.repo';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(USER_REPO) private readonly users: UserRepo) {}

  async execute(
    id: string,
    input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      role?: any;
    },
  ) {
    const user = await this.users.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (input.email && input.email !== user.email) {
      const existingEmail = await this.users.findByEmail(input.email);

      if (existingEmail) {
        throw new ConflictException('Email already used');
      }
    }

    if (input.phoneNumber && input.phoneNumber !== user.phoneNumber) {
      const existingPhone = await this.users.findByPhone(input.phoneNumber);

      if (existingPhone) {
        throw new ConflictException('Phone number already used');
      }
    }

    const updatedUser = user.copyWith({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      role: input.role,
      updatedAt: new Date(),
    });

    return this.users.save(updatedUser);
  }
}