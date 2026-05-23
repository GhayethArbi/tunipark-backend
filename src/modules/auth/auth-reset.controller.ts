import { Body, Controller, Post } from '@nestjs/common';
import { RequestResetEmailOtpUseCase } from './use-cases/forgot-password/request-reset-email-otp.usecase';
import { VerifyResetEmailOtpUseCase } from './use-cases/forgot-password/verify-reset-email-otp.usecase';
import { ResetPasswordUseCase } from './use-cases/forgot-password/reset-password.usecase';
import { RequestResetEmailOtpDto } from './dto/forgot-password/request-reset-email-otp.dto';
import { RequestResetPhoneOtpDto } from './dto/forgot-password/request-reset-phone-otp.dto';
import { ResetPasswordDto } from './dto/forgot-password/reset-password.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto';
import { RequestResetPhoneOtpUseCase } from './use-cases/forgot-password/request-reset-phone-otp.usecase';
import { VerifyResetPhoneOtpUseCase } from './use-cases/forgot-password/verify-reset-phone-otp.usecase';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth - Password Reset')
@Controller('auth/password')
export class AuthResetController {
    constructor(
        private readonly requestResetEmailOtp: RequestResetEmailOtpUseCase,
        private readonly requestResetPhoneOtp: RequestResetPhoneOtpUseCase,
        private readonly verifyResetEmailOtp: VerifyResetEmailOtpUseCase,
        private readonly verifyResetPhoneOtp: VerifyResetPhoneOtpUseCase,
        private readonly resetPassword: ResetPasswordUseCase,
    ) { }

    @Post('reset/email/request')
    @ApiOperation({ summary: 'Request password reset OTP by email' })
    requestEmailOtp(@Body() dto: RequestResetEmailOtpDto) {
        return this.requestResetEmailOtp.execute(dto.email);
    }

    @Post('reset/phone/request')
    @ApiOperation({ summary: 'Request password reset OTP by phone number' })
    requestPhoneOtp(@Body() dto: RequestResetPhoneOtpDto) {
        return this.requestResetPhoneOtp.execute(dto.phoneNumber);
    }

    @Post('reset/email/verify')
    @ApiOperation({ summary: 'Verify password reset OTP sent to email' })
    verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) {
        return this.verifyResetEmailOtp.execute(dto.email, dto.otp);
    }

    @Post('reset/phone/verify')
    @ApiOperation({ summary: 'Verify password reset OTP sent to phone number' })
    verifyPhoneOtp(@Body() dto: VerifyPhoneOtpDto) {
        return this.verifyResetPhoneOtp.execute(dto.phoneNumber, dto.otp);
    }

    @Post('reset')
    @ApiOperation({ summary: 'Reset password using reset token + new password' })
    reset(@Body() dto: ResetPasswordDto) {
        // dto.token is resetToken returned by verify step
        return this.resetPassword.execute(dto.token, dto.newPassword);
    }

   
}
