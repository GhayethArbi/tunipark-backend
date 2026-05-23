import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { USER_REPO, UserRepo } from '../../users/repositories/user.repo';
import { BcryptService } from '../../../common/services/bcrypt.service';
import { UserRole } from '../../users/domain/user-role.enum';
import { TokenService } from '../services/token.service';
import * as jwt from 'jsonwebtoken';
import { MailService } from 'src/common/mail/mail.service';
import { OtpService } from '../services/otp.service';
@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPO) private readonly users: UserRepo,
    private readonly bcrypt: BcryptService,
    private readonly tokens: TokenService,
    private mailService: MailService,
    private readonly otp: OtpService,
  ) { }

  async execute(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const email = input.email;
    if (await this.users.findByEmail(input.email)) throw new ConflictException('Email already used');
    if (await this.users.findByPhone(input.phoneNumber)) throw new ConflictException('Phone number already used');

    const passwordHash = await this.bcrypt.hash(input.password);

    const code = this.otp.generate6Digits();
    const codeHash = this.otp.hashOtp(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await this.users.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: passwordHash,
      role: UserRole.USER,
      phoneOtpHash: codeHash,
      phoneOtpExpiresAt: expiresAt,
    });

    // TODO: send SMS with `code`
    // await this.sms.send(phoneNumber, `Your verification code is ${code}`);

    console.log('[DEV OTP]', user.phoneNumber, code); // ✅ dev only!!!!!!!!!!!!!!!!!!!!!!!

    const secret = process.env.JWT_SECRET;
    const confirmationToken = jwt.sign({ email }, secret, { expiresIn: '1h' });

    this.mailService.sendConfirmEmail(email, confirmationToken);
    const accessToken = this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
    };
  }
}
