import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaCollectionsController } from './media-collections.controller.js';
import { MediaCollectionsService } from './media-collections.service.js';
import { MediaCollection } from './entities/media-collection.entity.js';
import { CollectionImage } from './entities/collection-image.entity.js';
import { StoredFile } from '../upload/entities/stored-file.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaCollection, CollectionImage, StoredFile]),
  ],
  controllers: [MediaCollectionsController],
  providers: [MediaCollectionsService],
  exports: [MediaCollectionsService],
})
export class MediaCollectionsModule {}
