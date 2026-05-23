import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestResetPhoneOtpDto {
  @ApiProperty({ example: '+21652012835' })
  @IsString()
  phoneNumber: string;
}
