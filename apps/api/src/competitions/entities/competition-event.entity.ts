import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Competition } from './competition.entity.js';
import { RegistrationEvent } from '../../registrations/entities/registration-event.entity.js';

@Entity('competition_events')
export class CompetitionEvent {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Competition, (competition) => competition.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'competition_id' })
  competition: Competition;

  @Column({ name: 'competition_id', type: 'bigint' })
  competition_id: number;

  @Column({ type: 'varchar', length: 20 })
  event_no: string; // e.g. 'E01', 'E02'

  @Column({ type: 'varchar', length: 255 })
  event_name: string; // e.g. '10M Air Pistol Men'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @OneToMany(() => RegistrationEvent, (re) => re.competition_event)
  registration_events: RegistrationEvent[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
