import { IsArray, ArrayMinSize, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsInt, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccessMode, ParkingSpotType, ParkingType } from '../domain/parking.enums';
import { ParkingVehicleType } from '../domain/parking-vehicle-type.enum';

export class CreateParkingDto {
  @ApiProperty({ example: 'Private Parking Lafayette', })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: ParkingType, example: ParkingType.PRIVATE, default: ParkingType.PRIVATE, })
  @IsEnum(ParkingType)
  type: ParkingType = ParkingType.PRIVATE;

  @ApiProperty({ enum: ParkingSpotType, example: ParkingSpotType.COVERED, })
  @IsEnum(ParkingSpotType)
  spotType: ParkingSpotType;

  @ApiProperty({ example: 'Secure parking with cameras and night security.', })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String], example: ['Camera', 'Guard', 'Covered', '24/7 Access'], })
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @ApiProperty({ type: [String], minItems: 3, example: ['/uploads/parkings/img1.jpg', '/uploads/parkings/img2.jpg', '/uploads/parkings/img3.jpg',], })
  @IsArray()
  @ArrayMinSize(3)
  @IsString({ each: true })
  pictures: string[];

  @ApiProperty({ example: { address: 'Rue de Marseille, Tunis', lat: 36.8065, lng: 10.1815, }, })
  @IsObject()
  location: Record<string, any>;

  @ApiProperty({ enum: AccessMode, example: AccessMode.FREQUENT, })
  @IsEnum(AccessMode)
  accessMode: AccessMode;

  @ApiProperty({ example: 'zone-id', required: false, nullable: true, })
  @IsOptional()

  @IsString()
  zoneId?: string;



  //new
  @ApiProperty({ example: 20, })
  @IsInt()
  maxPlaces: number;

  @ApiProperty({ example: '08:00', })
  @IsString()
  openingTime: string;

  @ApiProperty({ example: '22:00', })
  @IsString()
  closingTime: string;

  @ApiProperty({ enum: ParkingVehicleType, isArray: true, example: ['SMALL', 'MEDIUM'], })
  @IsArray()
  @IsEnum(ParkingVehicleType, { each: true })
  vehicleTypes: ParkingVehicleType[];
}