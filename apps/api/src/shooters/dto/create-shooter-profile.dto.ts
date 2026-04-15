import {
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateShooterProfileDto {
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsString()
  issf_id?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  state_association_id?: number;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;

  @IsOptional()
  @IsString()
  coach_name?: string;

  @IsOptional()
  @IsString()
  club_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  event_type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  guardian_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  pci_id?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsString()
  signature_url?: string;

  @IsOptional()
  @IsString()
  birth_certificate_url?: string;

  @IsOptional()
  @IsString()
  aadhar_card_url?: string;

  @IsOptional()
  @IsString()
  pan_card_url?: string;

  @IsOptional()
  @IsString()
  passport_doc_url?: string;

  @IsOptional()
  @IsString()
  arms_license_url?: string;

  @IsOptional()
  @IsString()
  affidavit_url?: string;

  @IsOptional()
  @IsString()
  ipc_card_url?: string;
}
