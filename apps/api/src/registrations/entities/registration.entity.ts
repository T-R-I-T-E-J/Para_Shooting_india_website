import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Competition } from '../../competitions/entities/competition.entity.js';
import { Shooter } from '../../shooters/entities/shooter.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { RegistrationEvent } from './registration-event.entity.js';

export enum RegistrationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum PaymentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

export enum RegistrationPaymentMethod {
  GATEWAY = 'gateway',
  SCREENSHOT = 'screenshot',
}

@Entity('registrations')
@Unique(['competition_id', 'shooter_id']) // No double-registration for same competition
export class Registration {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Competition, (comp) => comp.registrations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'competition_id' })
  competition: Competition;

  @Column({ name: 'competition_id', type: 'bigint' })
  competition_id: number;

  @ManyToOne(() => Shooter, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'shooter_id' })
  shooter: Shooter;

  @Column({ name: 'shooter_id', type: 'bigint' })
  shooter_id: number;

  /**
   * Atomically minted sequential ID, e.g. "COMP-0135-001".
   * Null until admin approves the registration.
   */
  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  competition_no: string | null;

  // --- Status ---
  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.SUBMITTED,
  })
  status: RegistrationStatus;

  // --- Payment ---
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: RegistrationPaymentMethod,
    default: RegistrationPaymentMethod.GATEWAY,
  })
  payment_method: RegistrationPaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string | null;

  @Column({ type: 'text', nullable: true })
  payment_proof_url: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'payment_verified_by' })
  payment_verified_by_user: User;

  @Column({ name: 'payment_verified_by', type: 'bigint', nullable: true })
  payment_verified_by: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  payment_verified_at: Date | null;

  // --- Other ---
  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @Column({ type: 'boolean', default: false })
  terms_accepted: boolean;

  @OneToMany(() => RegistrationEvent, (re) => re.registration, {
    cascade: true,
  })
  registration_events: RegistrationEvent[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
