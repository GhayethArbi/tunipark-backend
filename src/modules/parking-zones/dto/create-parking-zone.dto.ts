import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateParkingZoneDto {
  @ApiProperty({ example: 'Zone Centre Ville' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Tunis' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'GeoJSON or custom geometry JSON',
    example: { type: 'Polygon', coordinates: [[[10.1, 36.8], [10.2, 36.8], [10.2, 36.9], [10.1, 36.9], [10.1, 36.8]]] },
  })
  @IsObject()
  geometry: Record<string, any>;
}
