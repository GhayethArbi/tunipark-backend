import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateParkingSessionDto {
  @ApiProperty({
    example: 'uuid-parking-id',
  })
  @IsString()
  @IsNotEmpty()
  parkingId: string;

  @ApiProperty({
    example: '123-TN-4567',
  })
  @IsString()
  @IsNotEmpty()
  vehiclePlate: string;

  @ApiPropertyOptional({
    example: 'Peugeot',
  })
  @IsString()
  @IsOptional()
  vehicleBrand?: string;

  @ApiPropertyOptional({
    example: '208',
  })
  @IsString()
  @IsOptional()
  vehicleModel?: string;

  @ApiProperty({
    example: '2026-05-19T10:00:00.000Z',
  })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    example: '2026-05-19T12:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({
    example: 120,
    description: 'Paid duration in minutes',
  })
  @IsInt()
  @IsPositive()
  paidDuration: number;
}