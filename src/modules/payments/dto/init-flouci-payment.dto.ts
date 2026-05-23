import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitFlouciPaymentDto {
  @ApiProperty({ example: 'uuid-session-id' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
