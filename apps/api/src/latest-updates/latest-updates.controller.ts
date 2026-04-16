import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { LatestUpdatesService } from './latest-updates.service';
import { CreateLatestUpdateDto } from './dto/create-latest-update.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller({ path: 'latest-updates', version: '1' })
export class LatestUpdatesController {
  constructor(private readonly service: LatestUpdatesService) {}

  @Post()
  @Roles('admin', 'system_admin')
  create(@Body() createDto: CreateLatestUpdateDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Public()
  findAll(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll(limitNum);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Roles('admin', 'system_admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
