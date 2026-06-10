import { IsString } from 'class-validator';

export class LogParkingViewDto {
  @IsString()
  parkingId: string;
}