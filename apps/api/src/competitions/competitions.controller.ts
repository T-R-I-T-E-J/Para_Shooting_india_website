import { Controller, Get, Param } from '@nestjs/common';
import { CompetitionsService } from './competitions.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Public()
  @Get()
  findAllActive() {
    return this.competitionsService.findAllActive();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOnePublic(+id);
  }
}
