import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveRegistrationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class RejectRegistrationDto {
  @IsString()
  @MaxLength(500)
  reason: string;
}

export class VerifyPaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
