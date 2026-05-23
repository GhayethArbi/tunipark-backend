import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarkPaidDto {
  @ApiPropertyOptional({ example: 'PROV-OK-REF-999' })
  @IsString()
  @IsOptional()
  providerReference?: string;
}
