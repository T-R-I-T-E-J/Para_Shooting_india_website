import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaCollectionDto } from './create-media-collection.dto.js';

export class UpdateMediaCollectionDto extends PartialType(CreateMediaCollectionDto) {}
