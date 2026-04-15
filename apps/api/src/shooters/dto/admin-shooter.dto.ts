import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class ApproveDto {
  @IsOptional()
  @IsNumber()
  approved_by?: number;
}

export class RejectDto {
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  rejected_by?: number;
}

export class AssignPciIdDto {
  @IsString()
  @Matches(/^PCI\/PSAI\/\d{4}\/\d{4}$/)
  pciId: string;
}

export class RevokeDto {
  @IsString()
  reason: string;
}

export class RequestChangesDto {
  @IsString()
  feedback: string;

  @IsOptional()
  @IsNumber()
  admin_id?: number;
}

export class ShooterFiltersDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
