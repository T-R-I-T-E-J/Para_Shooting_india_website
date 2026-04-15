import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompetitionEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  event_no: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  event_name: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  fee: number;
}
