import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {

    @ApiProperty({ example: 'test@gmail.com or +21652012835', })
    @IsString()
    identifier: string;

    @ApiProperty({ example: '123456', })
    @IsString()
    @MinLength(6)
    password: string;
}
