import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateTariffDto {
  @ApiProperty({ example: 2000, description: 'Price per unit (ex: per hour) in smallest currency unit' })
  @IsOptional()

  @IsInt()
  @Min(0)
  pricePerUnit: number;


  @ApiProperty({ example: 5 })
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: 120 })
  @IsNumber()
  pricePerMonth: number;
  @ApiProperty({ example: 30, description: 'Minimum duration in minutes' })
  @IsInt()
  @Min(0)
  minDuration: number;

  @ApiProperty({ example: 240, description: 'Maximum duration in minutes' })
  @IsInt()
  @Min(0)
  maxDuration: number;

  @ApiProperty({ example: '9b012fbb-831a-43b1-9cdf-36cbb83b247e' })
  @IsString()
  @IsNotEmpty()
  parkingId: string;
}
