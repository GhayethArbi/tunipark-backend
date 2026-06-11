import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogParkingViewDto {

    @ApiProperty({ example: 'd4efc3aa-5f55-4fe0-8d68-b96d623ece41', })
    @IsString()
    parkingId: string;
}
