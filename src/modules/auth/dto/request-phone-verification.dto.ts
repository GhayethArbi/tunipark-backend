import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestPhoneVerificationDto {
  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
