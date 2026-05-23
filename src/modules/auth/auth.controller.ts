import { Body, Controller, Get, HttpCode, Post, Query, Res, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { SignupUseCase } from './use-cases/signup.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyEmailUseCase } from './use-cases/verify-email.usecase';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { RequestPhoneVerificationUseCase } from './use-cases/request-phone-verification.usecase';
import { VerifyPhoneOtpUseCase } from './use-cases/verify-phone-otp.usecase';
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto';
import { Throttle } from '@nestjs/throttler';
import { OtpThrottlerGuard } from './guards/otp-throttler.guard';
import { RequestPhoneVerificationDto } from './dto/request-phone-verification.dto';
import { RefreshUseCase } from './use-cases/refresh.usecase';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly signup: SignupUseCase,
        private readonly login: LoginUseCase,
        private readonly verifyEmailUseCase: VerifyEmailUseCase,
        private readonly requestPhone: RequestPhoneVerificationUseCase,
        private readonly verifyPhone: VerifyPhoneOtpUseCase,
        private readonly refreshUseCase: RefreshUseCase,
    ) { }

    @Post('signup')
    @ApiOperation({ summary: 'Create a new user account' })
    signupUser(@Body() dto: SignupDto) {
        return this.signup.execute(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user and get JWT token' })
    loginUser(@Body() dto: LoginDto) {
        return this.login.execute(dto);
    }

    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string, @Res() res: Response,) {

        const basePath = path.join(process.cwd(), 'src', 'modules', 'auth', 'templates',);
        try {
            await this.verifyEmailUseCase.execute(token);
            const successHtml = fs.readFileSync(
                path.join(basePath, 'email-verified.html'),
                'utf8',
            );

            return res.type('html').send(successHtml);
        } catch (err: any) {
            const expiredHtml = fs.readFileSync(path.join(basePath, 'email-expired.html'), 'utf8',);

            return res.type('html').send(expiredHtml);
        }
    }

    @Post('request-phone-verification')
    @ApiOperation({ summary: 'Send OTP to phone number' })
    @ApiBody({ type: RequestPhoneVerificationDto })
    @UseGuards(OtpThrottlerGuard)
    @Throttle({ default: { ttl: 60, limit: 3 } })
    requestPhoneVerification(@Body() dto: RequestPhoneVerificationDto) {
        return this.requestPhone.execute(dto.phoneNumber);
    }


    @Post('verify-phone-otp')
    @ApiOperation({ summary: 'Verify phone OTP and mark phone as verified' })
    @ApiBody({ type: VerifyPhoneOtpDto })
    @UseGuards(OtpThrottlerGuard)
    @Throttle({ default: { ttl: 60, limit: 10 } }) // ✅ 10 attempts / minute
    verifyPhoneOtp(@Body() dto: VerifyPhoneOtpDto) {
        return this.verifyPhone.execute(dto.phoneNumber, dto.otp);
    }

    @Post('refresh')
    @HttpCode(200)
    refresh(@Body() dto: RefreshDto) {
        console.log("refresh token called ");
        return this.refreshUseCase.execute(dto.refreshToken);
    }
}
