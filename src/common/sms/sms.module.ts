import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { LocalSmsProvider } from './local-sms.provider';
import { SmsProvider } from './sms.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    SmsService,
    LocalSmsProvider,
    { provide: 'SMS_PROVIDER', useExisting: LocalSmsProvider },
  ],
  exports: [SmsService],
})
export class SmsModule {}
