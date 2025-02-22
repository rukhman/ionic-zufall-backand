import { IsEmail, IsString, IsISO8601, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { E_Gender } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nameFirst: string;

  @IsString()
  @MinLength(1)
  nameLast: string;

  @IsISO8601()
  birthDate: Date;

  @IsNotEmpty()
  @IsEnum(E_Gender)
  gender: E_Gender;
}
