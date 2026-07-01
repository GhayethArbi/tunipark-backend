import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { RegisterFcmTokenUseCase } from './use-cases/register-fcm-token.use-case';
import { FindUserNotificationsUseCase } from './use-cases/find-user-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read.use-case';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly registerFcmTokenUseCase: RegisterFcmTokenUseCase,
    private readonly findUserNotificationsUseCase: FindUserNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
  ) {}

  @Post('fcm-token')
  registerFcmToken(@Req() req, @Body() dto: RegisterFcmTokenDto) {
    return this.registerFcmTokenUseCase.execute(
      req.user.id,
      dto.token,
      dto.platform,
    );
  }

  @Get()
  findMyNotifications(@Req() req) {
    return this.findUserNotificationsUseCase.execute(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.markNotificationAsReadUseCase.execute(req.user.id, id);
  }
}