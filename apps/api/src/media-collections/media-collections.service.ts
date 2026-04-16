import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaCollection } from './entities/media-collection.entity';
import { CollectionImage } from './entities/collection-image.entity';
import { CreateMediaCollectionDto } from './dto/create-media-collection.dto';
import { UpdateMediaCollectionDto } from './dto/update-media-collection.dto';

@Injectable()
export class MediaCollectionsService {
  constructor(
    @InjectRepository(MediaCollection)
    private collectionRepo: Repository<MediaCollection>,
    @InjectRepository(CollectionImage)
    private imageRepo: Repository<CollectionImage>,
  ) {}

  async create(dto: CreateMediaCollectionDto): Promise<MediaCollection> {
    const collection = this.collectionRepo.create(dto);
    return this.collectionRepo.save(collection);
  }

  async findAll(): Promise<MediaCollection[]> {
    return this.collectionRepo.find({
      relations: ['images'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<MediaCollection> {
    const collection = await this.collectionRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!collection) {
      throw new NotFoundException(`Media collection #${id} not found`);
    }
    return collection;
  }

  async update(id: number, dto: UpdateMediaCollectionDto): Promise<MediaCollection> {
    const collection = await this.findOne(id);
    Object.assign(collection, dto);
    return this.collectionRepo.save(collection);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // just to ensure it exists
    await this.collectionRepo.softDelete(id);
  }

  async addImage(
    collectionId: number,
    imageUrl: string,
    caption?: string,
  ): Promise<CollectionImage> {
    // Verify collection exists
    await this.findOne(collectionId);
    const image = this.imageRepo.create({
      collection_id: collectionId,
      image_url: imageUrl,
      caption,
    });
    return this.imageRepo.save(image);
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new NotFoundException(`Image #${imageId} not found`);
    await this.imageRepo.remove(image);
  }
}
