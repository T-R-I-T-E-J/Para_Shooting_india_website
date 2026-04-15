import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service.js';
import { CreateCompetitionDto } from './dto/create-competition.dto.js';
import { UpdateCompetitionDto } from './dto/update-competition.dto.js';
import { CreateCompetitionEventDto } from './dto/create-competition-event.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';

@Controller('admin/competitions')
@UseGuards(JwtAuthGuard)
export class CompetitionAdminController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  // ─── Competition CRUD ────────────────────────────────────────────────────────

  @RequirePermissions('competitions:create')
  @Post()
  create(@Body() dto: CreateCompetitionDto) {
    return this.competitionsService.create(dto);
  }

  @RequirePermissions('competitions:read')
  @Get()
  findAll() {
    return this.competitionsService.findAll();
  }

  @RequirePermissions('competitions:read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.findOne(id);
  }

  @RequirePermissions('competitions:read')
  @Get(':id/stats')
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.getStats(id);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompetitionDto,
  ) {
    return this.competitionsService.update(id, dto);
  }

  @RequirePermissions('competitions:delete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.remove(id);
  }

  // ─── Sub-Event Management ────────────────────────────────────────────────────

  @RequirePermissions('competitions:update')
  @Post(':id/events')
  addEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCompetitionEventDto,
  ) {
    return this.competitionsService.addEvent(id, dto);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/events/:eventId')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: Partial<CreateCompetitionEventDto>,
  ) {
    return this.competitionsService.updateEvent(id, eventId, dto);
  }

  @RequirePermissions('competitions:update')
  @Delete(':id/events/:eventId')
  removeEvent(
    @Param('id', ParseIntPipe) id: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.competitionsService.removeEvent(id, eventId);
  }
}
