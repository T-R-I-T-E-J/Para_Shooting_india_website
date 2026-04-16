import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LatestUpdate } from './entities/latest-update.entity';
import { CreateLatestUpdateDto } from './dto/create-latest-update.dto';

@Injectable()
export class LatestUpdatesService {
  constructor(
    @InjectRepository(LatestUpdate)
    private latestUpdateRepo: Repository<LatestUpdate>,
  ) {}

  async create(createDto: CreateLatestUpdateDto) {
    const update = this.latestUpdateRepo.create(createDto);
    return await this.latestUpdateRepo.save(update);
  }

  async findAll(limit?: number) {
    const query = this.latestUpdateRepo
      .createQueryBuilder('update')
      .orderBy('update.created_at', 'DESC');
      
    if (limit) {
      query.take(limit);
    }
    
    return await query.getMany();
  }

  async findOne(id: number) {
    const update = await this.latestUpdateRepo.findOne({ where: { id } });
    if (!update) {
      throw new NotFoundException(`Latest update with ID ${id} not found`);
    }
    return update;
  }

  async remove(id: number) {
    const update = await this.findOne(id);
    return await this.latestUpdateRepo.softRemove(update);
  }
}
