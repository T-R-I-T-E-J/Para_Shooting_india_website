import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LatestUpdate } from './entities/latest-update.entity';
import { CreateLatestUpdateDto } from './dto/create-latest-update.dto';
import { UpdateLatestUpdateDto } from './dto/update-latest-update.dto';

@Injectable()
export class LatestUpdatesService {
  constructor(
    @InjectRepository(LatestUpdate)
    private latestUpdateRepo: Repository<LatestUpdate>,
  ) {}

  async create(createDto: CreateLatestUpdateDto) {
    const update = this.latestUpdateRepo.create(createDto);
    if (!update.date) {
      update.date = new Date();
    }
    return await this.latestUpdateRepo.save(update);
  }

  async findAll(limit?: number) {
    const query = this.latestUpdateRepo
      .createQueryBuilder('update')
      .orderBy('update.date', 'DESC');
      
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

  async update(id: number, updateDto: UpdateLatestUpdateDto) {
    const update = await this.findOne(id);
    Object.assign(update, updateDto);
    if (!update.date) {
      update.date = new Date();
    }
    return await this.latestUpdateRepo.save(update);
  }

  async remove(id: number) {
    const update = await this.findOne(id);
    return await this.latestUpdateRepo.softRemove(update);
  }
}
