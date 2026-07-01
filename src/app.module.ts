import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailService } from './common/mail/mail.service';
import { AuthCommonModule } from './common/auth/auth-common.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SmsService } from './common/sms/sms.service';
import { ParkingsModule } from './modules/parkings/parkings.module';
import { ParkingZonesModule } from './modules/parking-zones/parking-zones.module';
import { TariffsModule } from './modules/tariffs/tariffs.module';
import { ParkingSessionsModule } from './modules/parking-sessions/parking-sessions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './common/services/bcrypt.service';
import { ParkingInteractionModule } from './modules/parking-interaction/parking-interaction.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60, limit: 20, },]),
  ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, UsersModule, AuthModule, AuthCommonModule,
    ParkingsModule, ParkingZonesModule, TariffsModule,
    ParkingSessionsModule, PaymentsModule, ParkingInteractionModule, AiModule, NotificationsModule ],

  controllers: [AppController],

  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },  
    AppService, MailService, SmsService, BcryptService],
})
export class AppModule { }
