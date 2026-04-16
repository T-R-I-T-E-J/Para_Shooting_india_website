import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CollectionImage } from './collection-image.entity.js';

@Entity('media_collections')
export class MediaCollection {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column({ type: 'text', nullable: true })
  full_description?: string;

  @Column({ type: 'text', nullable: true })
  featured_image?: string;

  @Column({ type: 'date', nullable: true })
  event_date?: Date;

  @OneToMany(() => CollectionImage, (img) => img.collection, { cascade: true })
  images: CollectionImage[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}
