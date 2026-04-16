import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaCollectionsService } from './media-collections.service.js';
import { CreateMediaCollectionDto } from './dto/create-media-collection.dto.js';
import { UpdateMediaCollectionDto } from './dto/update-media-collection.dto.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { multerConfig } from '../config/multer.config.js';
import {
  fromBuffer as fileTypeFromBuffer,
  fromFile as fileTypeFromFile,
} from 'file-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredFile } from '../upload/entities/stored-file.entity.js';

@Controller({ path: 'media-collections', version: '1' })
export class MediaCollectionsController {
  constructor(
    private readonly service: MediaCollectionsService,
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  // ─── Helper: save uploaded image to DB or disk ─────────────────────────────
  private async saveImage(file: Express.Multer.File): Promise<string> {
    const baseUrl =
      process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || '';

    let actualType: { mime: string } | undefined;
    if (file.buffer) {
      const t = (await fileTypeFromBuffer(file.buffer)) as { mime: string } | undefined;
      actualType = t;
    } else if (file.path) {
      const t = (await fileTypeFromFile(file.path)) as { mime: string } | undefined;
      actualType = t;
    }

    if (actualType && !actualType.mime.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed.');
    }

    if (file.buffer) {
      const stored = this.filesRepository.create({
        filename: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
        size: file.size,
      });
      const saved = await this.filesRepository.save(stored);
      return `${baseUrl}/api/v1/upload/view/${saved.filename}`;
    } else {
      return `${baseUrl}/api/v1/uploads/${file.filename}`;
    }
  }

  // ─── Create collection ──────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Post()
  create(@Body() dto: CreateMediaCollectionDto) {
    return this.service.create(dto);
  }

  // ─── List all collections (public) ─────────────────────────────────────────
  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ─── Get single collection (public) ────────────────────────────────────────
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ─── Update collection ──────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaCollectionDto,
  ) {
    return this.service.update(id, dto);
  }

  // ─── Delete collection ──────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // ─── Upload featured image ──────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Post(':id/featured-image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadFeaturedImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No image uploaded');
    const url = await this.saveImage(file);
    await this.service.update(id, { featured_image: url });
    return { url };
  }

  // ─── Add image to collection ────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async addImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No image uploaded');
    const url = await this.saveImage(file);
    const image = await this.service.addImage(id, url);
    return image;
  }

  // ─── Remove image from collection ──────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @Delete('images/:imageId')
  removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.service.removeImage(imageId);
  }
}
