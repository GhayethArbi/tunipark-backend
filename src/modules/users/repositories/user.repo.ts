import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.enum';

export const USER_REPO = 'USER_REPO';

export interface UserRepo {
  create(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole;
    phoneOtpHash: string;
    phoneOtpExpiresAt: Date;
  }): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
  findByPhone(phoneNumber: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>
  updatePhoneOtp(
    userId: string,
    otpHash: string | null,
    expiresAt: Date | null,
  ): Promise<void>;
  updatePhoneResetOtp(userId: string,
    phoneOtpHash: string | null,
    expiresAt: Date | null): Promise<void>;
  delete(id: string): Promise<void>;

}
