import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { USER_REPO, UserRepo } from '../repositories/user.repo';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Injectable()
export class ChangePasswordUseCase {
    constructor(@Inject(USER_REPO) private readonly users: UserRepo,
        private readonly bcrypt: BcryptService
    ) { }

    async execute(
        id: string,
        input: {
            currentPassword: string;
            newPassword: string;
        },
    ) {
        const user = await this.users.findById(id);
        console.log("users.findById(" + id + "): " + user);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.bcrypt.compare(
            input.currentPassword,
            user.password,
        );
        console.log("isPasswordValid :"+ isPasswordValid);

        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const isSamePassword = await this.bcrypt.compare(
            input.newPassword,
            user.password,
        );
        console.log("isSamePassword :"+ isSamePassword); 

        if (isSamePassword) {
            throw new BadRequestException(
                'New password must be different from current password',
            );
        }

        const passwordHash = await this.bcrypt.hash(input.newPassword);
        console.log("passwordHash :"+ passwordHash);

        const updatedUser = user.copyWith({
            password: passwordHash,
            updatedAt: new Date(),
        });

        await this.users.save(updatedUser);

        return {
            message: 'Password changed successfully',
        };
    }
}