import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity.js';
import { CompetitionEvent } from './entities/competition-event.entity.js';
import { CompetitionsService } from './competitions.service.js';
import { CompetitionNumberService } from './competition-number.service.js';
import { CompetitionsController } from './competitions.controller.js';
import { CompetitionAdminController } from './competition-admin.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, CompetitionEvent])],
  controllers: [CompetitionsController, CompetitionAdminController],
  providers: [CompetitionsService, CompetitionNumberService],
  exports: [CompetitionsService, CompetitionNumberService],
})
export class CompetitionsModule {}
