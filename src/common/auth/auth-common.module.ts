import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me',
    }),
  ],
  providers: [JwtGuard],
  exports: [JwtModule, JwtGuard],
})
export class AuthCommonModule { }
