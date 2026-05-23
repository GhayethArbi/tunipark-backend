import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserRepo } from './user.repo';
import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.enum';

@Injectable()
export class PrismaUserRepo implements UserRepo {
  constructor(private readonly prisma: PrismaService) { }

  async create(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole;
    phoneOtpHash: string;
    phoneOtpExpiresAt: Date;
  }): Promise<User> {
    const u = await this.prisma.user.create({ data: input });
    return new User(u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.isPhoneNumberVerified, u.isEmailVerified, u.isBanned, u.password, u.role as UserRole, u.createdAt, u.updatedAt, u.phoneOtpHash, u.phoneOtpExpiresAt, u.phoneResetOtpHash, u.phoneResetOtpExpiresAt, u.emailResetOtpHash, u.emailResetOtpExpiresAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    return u ? new User(u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.isPhoneNumberVerified, u.isEmailVerified, u.isBanned, u.password, u.role as UserRole, u.createdAt, u.updatedAt, u.phoneOtpHash, u.phoneOtpExpiresAt, u.phoneResetOtpHash, u.phoneResetOtpExpiresAt, u.emailResetOtpHash, u.emailResetOtpExpiresAt) : null;
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { phoneNumber } });
    return u ? new User(u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.isPhoneNumberVerified, u.isEmailVerified, u.isBanned, u.password, u.role as UserRole, u.createdAt, u.updatedAt, u.phoneOtpHash, u.phoneOtpExpiresAt, u.phoneResetOtpHash, u.phoneResetOtpExpiresAt, u.emailResetOtpHash, u.emailResetOtpExpiresAt) : null;
  }

  async findById(id: string): Promise<User | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    return u ? new User(u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.isPhoneNumberVerified, u.isEmailVerified, u.isBanned, u.password, u.role as UserRole, u.createdAt, u.updatedAt, u.phoneOtpHash, u.phoneOtpExpiresAt, u.phoneResetOtpHash, u.phoneResetOtpExpiresAt, u.emailResetOtpHash, u.emailResetOtpExpiresAt) : null;
  }

  async save(user: User): Promise<User> {
    const u = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
        isEmailVerified: user.isEmailVerified,
        isBanned: user.isBanned,
        password: user.password,
        role: user.role,
        updatedAt: new Date(),

      },
    });

    return u ? new User(u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.isPhoneNumberVerified, u.isEmailVerified, u.isBanned, u.password, u.role as UserRole, u.createdAt, u.updatedAt, u.phoneOtpHash, u.phoneOtpExpiresAt, u.phoneResetOtpHash, u.phoneResetOtpExpiresAt, u.emailResetOtpHash, u.emailResetOtpExpiresAt) : null;
  }
  async updatePhoneOtp(userId: string, otpHash: string | null, expiresAt: Date | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneOtpHash: otpHash,
        phoneOtpExpiresAt: expiresAt,
      },
    });
  }
  async updatePhoneResetOtp(userId: string, OtpHash: string | null, expiresAt: Date | null): Promise<void> {

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneResetOtpHash: OtpHash,
        phoneResetOtpExpiresAt: expiresAt,
      },
    });
  }
  async delete(id: string): Promise<void> { await this.prisma.user.delete({ where: { id }, }); }
}