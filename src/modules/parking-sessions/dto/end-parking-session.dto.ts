import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class EndParkingSessionDto {
  @ApiPropertyOptional({ example: false, description: 'If true, cancel instead of end' })
  @IsBoolean()
  @IsOptional()
  cancel?: boolean;
}
