import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ArrayMinSize,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrationPaymentMethod } from '../entities/registration.entity.js';

export class CreateRegistrationDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  competition_id: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  event_ids: number[]; // IDs of CompetitionEvents to register for

  @IsEnum(RegistrationPaymentMethod)
  payment_method: RegistrationPaymentMethod;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsString()
  @IsOptional()
  payment_proof_url?: string;

  @IsBoolean()
  @IsNotEmpty()
  terms_accepted: boolean;
}
