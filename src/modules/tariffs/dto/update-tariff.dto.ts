import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTariffDto {
  @ApiPropertyOptional({ example: 2500 })
  @IsInt()
  @Min(0)
  @IsOptional()
  pricePerUnit?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @Min(0)
  @IsOptional()
  minDuration?: number;

  @ApiPropertyOptional({ example: 360 })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxDuration?: number;
}
