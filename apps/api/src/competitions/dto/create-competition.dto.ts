import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaymentMode } from '../entities/competition.entity.js';

export class CreateCompetitionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsDateString()
  duration_start: string;

  @IsDateString()
  duration_end: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  place: string;

  @IsEnum(PaymentMode)
  @IsOptional()
  payment_mode?: PaymentMode;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
