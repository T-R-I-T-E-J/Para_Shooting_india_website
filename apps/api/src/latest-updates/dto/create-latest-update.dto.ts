import { IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentDto {
  @IsString()
  url: string;

  @IsString()
  name: string;
}

export class CreateLatestUpdateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentDto)
  document?: DocumentDto;
}
