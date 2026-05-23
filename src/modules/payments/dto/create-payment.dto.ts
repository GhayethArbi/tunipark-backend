import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-session-id' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ example: 'D17', description: 'Payment provider name (D17, Flouci, Orange, etc.)' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 1200, description: 'Amount in smallest currency unit (millimes/centimes)' })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'REF-12345' })
  @IsString()
  @IsOptional()
  providerReference?: string;
}
