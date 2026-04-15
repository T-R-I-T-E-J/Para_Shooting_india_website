import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Registration } from './registration.entity.js';
import { CompetitionEvent } from '../../competitions/entities/competition-event.entity.js';

@Entity('registration_events')
export class RegistrationEvent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Registration, (reg) => reg.registration_events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;

  @Column({ name: 'registration_id', type: 'bigint' })
  registration_id: number;

  @ManyToOne(() => CompetitionEvent, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'competition_event_id' })
  competition_event: CompetitionEvent;

  @Column({ name: 'competition_event_id', type: 'bigint' })
  competition_event_id: number;

  /**
   * Snapshot of the event name at the time of registration.
   * Preserved even if the original event name is later edited.
   */
  @Column({ type: 'varchar', length: 255 })
  event_name_snapshot: string;

  /**
   * Snapshot of the fee at the time of registration.
   * Preserved even if the fee changes later.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee_snapshot: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
