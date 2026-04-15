import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request as Req,
} from '@nestjs/common';
import { Request } from 'express';
import { NewsService } from './news.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';

import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { NewsStatus } from './entities/news.entity.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @Req() req: Request & { user: { id: string | number } },
  ) {
    const authorId = req.user?.id ? Number(req.user.id) : 2;
    return this.newsService.create(createNewsDto, authorId);
  }

  @Get()
  @Public()
  findAll(@Query('status') status?: NewsStatus) {
    return this.newsService.findAll(status);
  }

  @Get('latest')
  @Public()
  findLatest() {
    return this.newsService.findPublished();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    // Support finding by ID or Slug would be nice, but matching routing is tricky if both are root relative.
    // If I use 'latest' above, it handles that.
    // If :id is number, findByID. Else findBySlug.

    if (/^\d+$/.test(id)) {
      return this.newsService.findOne(+id);
    }
    return this.newsService.findOneBySlug(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    // Check if ID is numeric
    if (/^\d+$/.test(id)) {
      return this.newsService.update(+id, updateNewsDto);
    }
    // If not numeric, try to find by slug first to get the numeric ID
    const news = await this.newsService.findOneBySlug(id);
    if (news) {
      return this.newsService.update(news.id, updateNewsDto);
    }
    // If still not found, it might be a public_id (UUID)
    // For now, let's assume slug. If we need public_id support, we'd add findByPublicId in service.
    throw new Error('News article not found with the given ID/Slug');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  async remove(@Param('id') id: string) {
    if (/^\d+$/.test(id)) {
      return this.newsService.remove(+id);
    }
    const news = await this.newsService.findOneBySlug(id);
    if (news) {
      return this.newsService.remove(news.id);
    }
    throw new Error('News article not found with the given ID/Slug');
  }
}
