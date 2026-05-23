import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarkFailedDto {
  @ApiPropertyOptional({ example: 'PROV-FAIL-REF-123' })
  @IsString()
  @IsOptional()
  providerReference?: string;
}
