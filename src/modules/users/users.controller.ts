import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../../common/auth/jwt.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordUseCase } from './use-cases/change-password.useCase';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly createUser: CreateUserUseCase,
        private readonly getUserById: GetUserByIdUseCase,
        private readonly updateUser: UpdateUserUseCase,
        private readonly deleteUser: DeleteUserUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,

    ) { }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.createUser.execute({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            password: dto.password,
            role: dto.role as any,
        });
    }

    @UseGuards(JwtGuard)
    @ApiBearerAuth('access-token')
    @Get('me')
    @ApiOperation({ summary: 'Get current authenticated user' })
    me(@CurrentUser() user: any) {
        return user;
    }

    @UseGuards(JwtGuard)
    @ApiBearerAuth('access-token')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserById.execute(id);
    }

    @UseGuards(JwtGuard)
    @ApiBearerAuth('access-token')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.updateUser.execute(id, dto);
    }

    @UseGuards(JwtGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.deleteUser.execute(id);
    }
    @UseGuards(JwtGuard)
    @ApiBearerAuth('access-token')
    @Patch(':id/change-password')
    async changePassword(
        @Param('id') id: string,
        @Body() dto: ChangePasswordDto,
    ) {
        console.log("change password start");
        return this.changePasswordUseCase.execute(id, dto);
    }
}