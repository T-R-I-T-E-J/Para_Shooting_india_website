import {
  Injectable,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download, DownloadCategory } from './entities/download.entity';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class DownloadsService implements OnModuleInit {
  private readonly logger = new Logger(DownloadsService.name);

  constructor(
    @InjectRepository(Download)
    private downloadRepository: Repository<Download>,
    private categoriesService: CategoriesService,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  async create(createDownloadDto: CreateDownloadDto): Promise<Download> {
    // Auto-calculate content_year from content_date
    if (createDownloadDto.contentDate) {
      createDownloadDto.contentYear = new Date(
        createDownloadDto.contentDate,
      ).getFullYear();
    }

    const download = this.downloadRepository.create(createDownloadDto);

    if (createDownloadDto.categoryId) {
      const category = await this.categoriesService.findOne(
        createDownloadDto.categoryId,
      );
      if (category) {
        if (category.page === 'results') {
          throw new BadRequestException(
            "Cannot assign 'results' category to a Download item",
          );
        }
        // Only overwrite category with slug if it's not already explicitly set
        // (e.g., 'classification' from frontend)
        if (!createDownloadDto.category) {
          download.category = category.slug;
        }
      }
    }

    return this.downloadRepository.save(download);
  }

  async update(
    id: string,
    updateDownloadDto: UpdateDownloadDto,
  ): Promise<Download> {
    const download = await this.findOne(id);

    // Auto-calculate content_year from content_date
    if (updateDownloadDto.contentDate) {
      updateDownloadDto.contentYear = new Date(
        updateDownloadDto.contentDate,
      ).getFullYear();
    }

    if (
      updateDownloadDto.categoryId &&
      updateDownloadDto.categoryId !== download.categoryId
    ) {
      const category = await this.categoriesService.findOne(
        updateDownloadDto.categoryId,
      );
      if (category) {
        if (category.page === 'results') {
          throw new BadRequestException(
            "Cannot assign 'results' category to a Download item",
          );
        }
        updateDownloadDto.category = category.slug;
      }
    }

    const updated = this.downloadRepository.merge(download, updateDownloadDto);
    return this.downloadRepository.save(updated);
  }

  async findAll(category?: string, year?: number): Promise<Download[]> {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    if (year) {
      where.contentYear = year;
    }
    return this.downloadRepository.find({
      where,
      order: { contentDate: 'DESC', createdAt: 'DESC' },
      relations: ['categoryRel'],
    });
  }

  async getDistinctYears(): Promise<number[]> {
    const results = await this.downloadRepository
      .createQueryBuilder('d')
      .select('DISTINCT d.content_year', 'year')
      .where('d.content_year IS NOT NULL')
      .andWhere('d.is_active = true')
      .orderBy('year', 'DESC')
      .getRawMany();
    return results.map((r) => r.year);
  }

  async findOne(id: string): Promise<Download> {
    const download = await this.downloadRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!download) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(`Download with ID "${id}" not found`);
    }
    return download;
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.categoriesService.findAll();
    return categories.map((c) => c.slug);
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log(`Attempting to remove download with id: ${id}`);
    const result = await this.downloadRepository.delete(id);

    if (result.affected === 0) {
      this.logger.warn(`Download with id ${id} not found for deletion`);
      // We can throw an error or just return a message.
      // Throwing NotFoundException is better for API semantics.
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException(`Download with ID "${id}" not found`);
    }

    this.logger.log(`Successfully removed download with id: ${id}`);
    return { message: 'Download deleted successfully' };
  }

  private async seedInitialData() {
    try {
      const count = await this.downloadRepository.count();
      if (count > 0) return;

      this.logger.log('Seeding initial downloads data...');
    } catch (error) {
      this.logger.warn(`Skipping seeding: ${error.message}`);
      return;
    }

    const baseUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.APP_URL ||
      'http://localhost:8080';

    const resolveUrl = (href: string) => {
      if (href.startsWith('http')) return href;
      // Ensure we point to the uploads served path
      // If href already starts with /uploads, just prepend base.
      // If href starts with /, prepend base + /uploads?
      // The seed data has '/para-shooting-criteria.pdf'.
      // Valid static file serving is likely at /uploads/...
      // So we want: https://api.../uploads/para-shooting-criteria.pdf
      return `${baseUrl}/uploads${href}`;
    };

    const rules = [
      {
        title: 'Para Shooting Criteria',
        description: 'Official Para Shooting criteria and guidelines document',
        fileType: 'PDF',
        href: resolveUrl('/para-shooting-criteria.pdf'),
        category: DownloadCategory.RULES,
      },
      {
        title: 'WSPS Rulebook 2026',
        description:
          'Official World Shooting Para Sport Rulebook - Final Version',
        fileType: 'PDF',
        size: 'External',
        href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%202026_vFinal_0.pdf',
        category: DownloadCategory.RULES,
      },
      {
        title: 'WSPS Rulebook Appendices 2026',
        description: 'Appendices to the Official WSPS Rulebook 2026',
        fileType: 'PDF',
        size: 'External',
        href: 'https://www.paralympic.org/sites/default/files/2025-12/WSPS%20Rulebook%20Appendices%202026_vFinal.pdf',
        category: DownloadCategory.RULES,
      },
      {
        title: 'Details for IPC Card & License',
        description: 'Details regarding IPC Card and IPC License',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/details-for-ipc-card-ipc-license/',
        category: DownloadCategory.RULES,
      },
      {
        title: 'State Association Email IDs',
        description: 'Contact details for State Associations',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/state-association-email-id/',
        category: DownloadCategory.RULES,
      },
    ];

    const selectionPolicies = [
      {
        title: '2025 National Selection Policy',
        description: 'National Selection Policy for Para Shooting - 2025',
        fileType: 'PDF',
        href: resolveUrl('/2025-national-selection-policy.pdf'),
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Policy - Paris 2024 Paralympics',
        description:
          'Selection criteria for Paris France 2024 Paralympic Games',
        fileType: 'PDF',
        href: resolveUrl('/selection-policy-paris-2024.pdf'),
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Policy - Tokyo 2020 Paralympics',
        description: 'Selection criteria for Tokyo Japan 2020 Paralympic Games',
        fileType: 'PDF',
        href: resolveUrl('/selection-policy-tokyo-2020.pdf'),
        category: DownloadCategory.SELECTION,
      },
      {
        title: 'Selection Committee Meeting',
        description: 'Selection Committee Meeting details/download',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/selection-committee-meeting-',
        category: DownloadCategory.SELECTION,
      },
    ];

    const eventCalendar = [
      {
        title: '2026-2027 Para Shooting Event Calendar',
        description:
          'Official event calendar for Para Shooting competitions 2026-2027',
        fileType: 'PDF',
        href: resolveUrl('/2026-2027-event-calendar.pdf'),
        category: DownloadCategory.CALENDAR,
      },
    ];

    const matchDocuments = [
      {
        title: 'Match Book - Zonal & National Championship 2022',
        description:
          'Match book for Zonal and National Para Shooting Championship 2022',
        fileType: 'PDF',
        href: resolveUrl('/match-book-2022.pdf'),
        category: DownloadCategory.MATCH,
      },
      {
        title: 'NOTICE for WSPS Grand Prix',
        description: 'Notice for WSPS Grand Prix',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/notice-for-wsps-grand-prix-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Results – 6th National Para',
        description: 'Results for 6th National Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/results-6th-national-para-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Circular – 6th Zonal Para',
        description: 'Circular for 6th Zonal Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/circular-6th-zonal-para-shooting-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Results – 6th Zonal Para',
        description: 'Results for 6th Zonal Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/results-6th-zonal-para-shooting-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'SCHEDULE & DETAIL',
        description: 'Schedule & Detail Sheet for 6th Zonal',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/schedule-detail-sheet-6th-zonal-',
        category: DownloadCategory.MATCH,
      },
      {
        title: 'Circular – 6th National',
        description: 'Circular for 6th National Para Shooting',
        fileType: 'Link',
        size: 'External',
        href: 'https://www.parashooting.in/circular-6th-national-para-',
        category: DownloadCategory.MATCH,
      },
    ];

    const categories = await this.categoriesService.findAll();
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    const allDownloads = [
      ...rules,
      ...selectionPolicies,
      ...eventCalendar,
      ...matchDocuments,
    ];

    for (const item of allDownloads) {
      const categoryId = categoryMap.get(item.category);
      await this.downloadRepository.save({
        ...item,
        categoryId: categoryId || null,
      });
    }

    this.logger.log(`Seeded ${allDownloads.length} download items.`);
  }
}
