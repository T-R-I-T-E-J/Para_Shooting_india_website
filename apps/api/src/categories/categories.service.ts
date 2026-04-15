import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        throw new ConflictException(
          `A category with slug "${createCategoryDto.slug}" already exists. Please use a different name.`,
        );
      }
      throw new BadRequestException(
        'Failed to create category: ' + (error as Error).message,
      );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') {
        throw new ConflictException(
          `A category with that slug already exists.`,
        );
      }
      throw new BadRequestException(
        'Failed to update category: ' + (error as Error).message,
      );
    }
  }

  findAll(page?: string) {
    const where = page ? { page, isActive: true } : { isActive: true };
    return this.categoryRepository.find({
      where,
      order: { order: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    try {
      const result = await this.categoryRepository.delete(id);

      if (result.affected === 0) {
        throw new Error('Category not found');
      }

      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      // Handle foreign key constraint violation
      const dbError = error as { code?: string };
      if (dbError.code === '23503') {
        throw new Error(
          'Cannot delete category because it is being used by one or more downloads. Please reassign or delete those downloads first.',
        );
      }
      throw error;
    }
  }
}
