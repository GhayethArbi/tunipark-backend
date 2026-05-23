import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AccessMode, ParkingSpotType, ParkingType } from '../domain/parking.enums';

export enum ParkingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class UpdateParkingDto {
  @ApiPropertyOptional({ example: 'Garage sécurisé centre-ville' })
  @IsString()
  @IsOptional()
  title?: string;

  // kept for backward compat — your frontend sends spotType not type
  @ApiPropertyOptional({ enum: ParkingType })
  @IsEnum(ParkingType)
  @IsOptional()
  type?: ParkingType;

  @ApiPropertyOptional({ enum: ParkingSpotType })
  @IsEnum(ParkingSpotType)
  @IsOptional()
  spotType?: ParkingSpotType;

  @ApiPropertyOptional({ example: 'Garage privé avec accès sécurisé...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Caméra de surveillance', 'Éclairé'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  characteristics?: string[];

  @ApiPropertyOptional({
    example: ['/uploads/parkings/abc.jpg', '/uploads/parkings/xyz.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pictures?: string[];

  @ApiPropertyOptional({ example: { address: '14 Rue des Jasmins', lat: 36.85, lng: 10.25 } })
  @IsObject()
  @IsOptional()
  location?: Record<string, any>;

  @ApiPropertyOptional({ example: '07:00' })
  @IsString()
  @IsOptional()
  openingTime?: string;

  @ApiPropertyOptional({ example: '22:00' })
  @IsString()
  @IsOptional()
  closingTime?: string;

  @ApiPropertyOptional({ enum: ParkingStatus })
  @IsEnum(ParkingStatus)
  @IsOptional()
  status?: ParkingStatus;

  @ApiPropertyOptional({ enum: AccessMode })
  @IsEnum(AccessMode)
  @IsOptional()
  accessMode?: AccessMode;

  @ApiPropertyOptional({ example: 'uuid-zone-id' })
  @IsString()
  @IsOptional()
  zoneId?: string;
}