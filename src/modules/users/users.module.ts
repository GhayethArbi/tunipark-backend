import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.usecase';
import { USER_REPO } from './repositories/user.repo';
import { PrismaUserRepo } from './repositories/prisma-user.repo';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { ChangePasswordUseCase } from './use-cases/change-password.useCase';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    PrismaUserRepo,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ChangePasswordUseCase,
    BcryptService,
    { provide: USER_REPO, useExisting: PrismaUserRepo },
  ],
  exports: [{ provide: USER_REPO, useExisting: PrismaUserRepo }],
})
export class UsersModule { }
