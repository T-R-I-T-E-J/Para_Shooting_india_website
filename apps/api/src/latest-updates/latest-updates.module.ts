import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestUpdatesService } from './latest-updates.service';
import { LatestUpdatesController } from './latest-updates.controller';
import { LatestUpdate } from './entities/latest-update.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LatestUpdate])],
  controllers: [LatestUpdatesController],
  providers: [LatestUpdatesService],
  exports: [LatestUpdatesService],
})
export class LatestUpdatesModule {}
