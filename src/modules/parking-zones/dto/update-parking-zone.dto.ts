import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateParkingZoneDto {
  @ApiPropertyOptional({ example: 'Zone Lac 1' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Tunis' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    example: { type: 'Polygon', coordinates: [[[10.0, 36.8], [10.3, 36.8], [10.3, 36.95], [10.0, 36.95], [10.0, 36.8]]] },
  })
  @IsObject()
  @IsOptional()
  geometry?: Record<string, any>;
}
