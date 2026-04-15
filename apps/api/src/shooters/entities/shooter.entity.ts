import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { StateAssociation } from '../../states/entities/state-association.entity.js';

@Entity('shooters')
export class Shooter {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  shooter_id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  issf_id: string | null;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'boolean', default: false })
  is_deaf: boolean;

  @Column({ type: 'varchar', length: 100, default: 'Indian' })
  nationality: string;

  @ManyToOne(() => StateAssociation)
  @JoinColumn({ name: 'state_association_id' })
  state_association: StateAssociation;

  @Column({ name: 'state_association_id', type: 'bigint', nullable: true })
  state_association_id: number | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  blood_group: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  emergency_contact_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergency_contact_phone: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  coach_name: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  club_name: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'jsonb', default: [] })
  achievements: any[];

  @Column({ type: 'boolean', default: false })
  profile_complete: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  verified_at: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verified_by' })
  verified_by_user: User;

  @Column({ name: 'verified_by', type: 'bigint', nullable: true })
  verified_by: number | null;

  @Column({ type: 'varchar', length: 30, default: 'incomplete' })
  registration_status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pci_id: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  event_type: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null;

  @Column({ name: 'approved_by', type: 'bigint', nullable: true })
  approved_by: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  approved_at: Date | null;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ type: 'text', nullable: true })
  admin_feedback: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  submitted_at: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  guardian_name: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({
    name: 'residential_state',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  state: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode: string | null;

  @Column({ type: 'text', nullable: true })
  photo_url: string | null;

  @Column({ type: 'text', nullable: true })
  signature_url: string | null;

  @Column({ type: 'text', nullable: true })
  birth_certificate_url: string | null;

  @Column({ type: 'text', nullable: true })
  aadhar_card_url: string | null;

  @Column({ type: 'text', nullable: true })
  pan_card_url: string | null;

  @Column({ type: 'text', nullable: true })
  passport_doc_url: string | null;

  @Column({ type: 'text', nullable: true })
  arms_license_url: string | null;

  @Column({ type: 'text', nullable: true })
  affidavit_url: string | null;

  @Column({ type: 'text', nullable: true })
  ipc_card_url: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
