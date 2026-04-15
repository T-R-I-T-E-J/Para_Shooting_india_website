import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionEvent } from './competition-event.entity.js';
import { Registration } from '../../registrations/entities/registration.entity.js';

export enum PaymentMode {
  GATEWAY = 'gateway',
  SCREENSHOT = 'screenshot',
}

@Entity('competitions')
export class Competition {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string; // e.g. '0135', used to build COMP-0135-XXX

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  duration_start: Date;

  @Column({ type: 'date' })
  duration_end: Date;

  @Column({ type: 'varchar', length: 255 })
  place: string;

  @Column({
    type: 'enum',
    enum: PaymentMode,
    default: PaymentMode.GATEWAY,
  })
  payment_mode: PaymentMode;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  /**
   * Atomic sequence counter for generating COMP-{code}-{sequence} IDs.
   * This is incremented atomically via a single SQL UPDATE ... RETURNING
   * statement, which prevents race conditions at any concurrency level.
   */
  @Column({ type: 'int', default: 0 })
  last_sequence_number: number;

  @OneToMany(() => CompetitionEvent, (event) => event.competition, {
    cascade: true,
  })
  events: CompetitionEvent[];

  @OneToMany(() => Registration, (reg) => reg.competition)
  registrations: Registration[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
