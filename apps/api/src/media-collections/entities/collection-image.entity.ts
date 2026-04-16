import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MediaCollection } from './media-collection.entity.js';

@Entity('collection_images')
export class CollectionImage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  collection_id: number;

  @ManyToOne(() => MediaCollection, (col) => col.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collection_id' })
  collection: MediaCollection;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  uploaded_at: Date;
}
