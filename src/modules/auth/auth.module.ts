import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SignupUseCase } from './use-cases/signup.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { BcryptService } from '../../common/services/bcrypt.service';
import { TokenService } from './services/token.service';
import { MailService } from 'src/common/mail/mail.service';
import { VerifyEmailUseCase } from './use-cases/verify-email.usecase';
import { OtpService } from './services/otp.service';
import { RequestPhoneVerificationUseCase } from './use-cases/request-phone-verification.usecase';
import { VerifyPhoneOtpUseCase } from './use-cases/verify-phone-otp.usecase';
import { OtpThrottlerGuard } from './guards/otp-throttler.guard';
import { SmsService } from 'src/common/sms/sms.service';
import { AuthResetController } from './auth-reset.controller';
import { RequestResetEmailOtpUseCase } from './use-cases/forgot-password/request-reset-email-otp.usecase';
import { RequestResetPhoneOtpUseCase } from './use-cases/forgot-password/request-reset-phone-otp.usecase';
import { VerifyResetEmailOtpUseCase } from './use-cases/forgot-password/verify-reset-email-otp.usecase';
import { VerifyResetPhoneOtpUseCase } from './use-cases/forgot-password/verify-reset-phone-otp.usecase';
import { ResetPasswordUseCase } from './use-cases/forgot-password/reset-password.usecase';
import { IdentifierService } from './services/identifier.service';
import { RefreshUseCase } from './use-cases/refresh.usecase';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me',
    }),
  ],
  controllers: [AuthController, AuthResetController],
  providers: [SignupUseCase, LoginUseCase, VerifyEmailUseCase, BcryptService, TokenService, MailService, SmsService, OtpService, VerifyPhoneOtpUseCase, RequestPhoneVerificationUseCase, OtpThrottlerGuard,
    RequestResetEmailOtpUseCase,
    RequestResetPhoneOtpUseCase,
    VerifyResetEmailOtpUseCase,
    VerifyResetPhoneOtpUseCase,
    ResetPasswordUseCase,
    RefreshUseCase,
    IdentifierService,
  ],
  exports: [JwtModule],
})
export class AuthModule { }
