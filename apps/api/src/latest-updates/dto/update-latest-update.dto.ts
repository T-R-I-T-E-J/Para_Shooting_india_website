import { PartialType } from '@nestjs/mapped-types';
import { CreateLatestUpdateDto } from './create-latest-update.dto';

export class UpdateLatestUpdateDto extends PartialType(CreateLatestUpdateDto) {}
