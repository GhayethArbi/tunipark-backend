import { UserRole } from './user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneNumber: string,

    public readonly isPhoneNumberVerified: boolean,
    public readonly isEmailVerified: boolean,
    public readonly isBanned: boolean,

    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,

    public readonly phoneOtpHash: string | null,
    public readonly phoneOtpExpiresAt: Date | null,


    public readonly phoneResetOtpHash: string | null,
    public readonly phoneResetOtpExpiresAt: Date | null,
    public readonly emailResetOtpHash: string | null,
    public readonly emailResetOtpExpiresAt: Date | null,
  ) { }

  copyWith(data: Partial<User>): User {
    return new User(
      this.id,
      data.firstName ?? this.firstName,
      data.lastName ?? this.lastName,
      data.email ?? this.email,
      data.phoneNumber ?? this.phoneNumber,

      data.isPhoneNumberVerified ?? this.isPhoneNumberVerified,
      data.isEmailVerified ?? this.isEmailVerified,
      data.isBanned ?? this.isBanned,

      data.password ?? this.password,
      data.role ?? this.role,
      this.createdAt,
      data.updatedAt ?? this.updatedAt,

      data.phoneOtpHash ?? this.phoneOtpHash,
      data.phoneOtpExpiresAt ?? this.phoneOtpExpiresAt,

      data.phoneResetOtpHash ?? this.phoneResetOtpHash,
      data.phoneResetOtpExpiresAt ?? this.phoneResetOtpExpiresAt,
      data.emailResetOtpHash ?? this.emailResetOtpHash,
      data.emailResetOtpExpiresAt ?? this.emailResetOtpExpiresAt
    );
  }
}
