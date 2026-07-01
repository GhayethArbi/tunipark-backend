import { Body, Controller, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { RegisterFcmTokenUseCase } from './use-cases/register-fcm-token.use-case';
import { FindUserNotificationsUseCase } from './use-cases/find-user-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './use-cases/mark-notification-as-read.use-case';
import { CurrentUser } from 'src/common/auth/current-user.decorator';
import { JwtGuard } from 'src/common/auth/jwt.guard';

@UseGuards(JwtGuard)
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
  findMyNotifications(@CurrentUser() user: any, @Req() req) {
   if (!user?.id && !user?.sub) throw new UnauthorizedException('Missing user');
      const userId = user.id ?? user.sub;
      console.log('User ID:', userId); // Log the user ID for debugging
    return this.findUserNotificationsUseCase.execute(userId);
  }

  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.markNotificationAsReadUseCase.execute(req.user.id, id);
  }
}