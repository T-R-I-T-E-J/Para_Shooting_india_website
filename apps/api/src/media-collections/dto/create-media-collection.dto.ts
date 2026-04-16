import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateMediaCollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsString()
  @IsOptional()
  full_description?: string;

  @IsString()
  @IsOptional()
  featured_image?: string;

  @IsDateString()
  @IsOptional()
  event_date?: string;
}
