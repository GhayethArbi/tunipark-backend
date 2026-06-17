import { IsNumber, IsPositive, IsString } from 'class-validator';

export class InitFlouciPaymentDto {
  @IsString()
  sessionId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}