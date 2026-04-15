import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Competition } from './entities/competition.entity.js';
import { CompetitionEvent } from './entities/competition-event.entity.js';
import { CreateCompetitionDto } from './dto/create-competition.dto.js';
import { UpdateCompetitionDto } from './dto/update-competition.dto.js';
import { CreateCompetitionEventDto } from './dto/create-competition-event.dto.js';

export interface CompetitionStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  revenue: string;
}

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepo: Repository<Competition>,
    @InjectRepository(CompetitionEvent)
    private readonly eventRepo: Repository<CompetitionEvent>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Public ─────────────────────────────────────────────────────────────────

  async findAllActive(): Promise<Competition[]> {
    return this.competitionRepo.find({
      where: { is_active: true },
      relations: ['events'],
      order: { duration_start: 'DESC' },
    });
  }

  async findOnePublic(id: number): Promise<Competition> {
    const competition = await this.competitionRepo.findOne({
      where: { id, is_active: true },
      relations: ['events'],
    });
    if (!competition) throw new NotFoundException('Competition not found');
    return competition;
  }

  // ─── Admin CRUD ──────────────────────────────────────────────────────────────

  async create(dto: CreateCompetitionDto): Promise<Competition> {
    const existing = await this.competitionRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(
        `A competition with code "${dto.code}" already exists`,
      );
    }
    const competition = this.competitionRepo.create(dto);
    return this.competitionRepo.save(competition);
  }

  async findAll(): Promise<Competition[]> {
    return this.competitionRepo.find({
      relations: ['events'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Competition> {
    const competition = await this.competitionRepo.findOne({
      where: { id },
      relations: ['events'],
    });
    if (!competition) throw new NotFoundException('Competition not found');
    return competition;
  }

  async update(id: number, dto: UpdateCompetitionDto): Promise<Competition> {
    const competition = await this.findOne(id);
    if (dto.code && dto.code !== competition.code) {
      const existing = await this.competitionRepo.findOne({
        where: { code: dto.code },
      });
      if (existing) {
        throw new ConflictException(
          `A competition with code "${dto.code}" already exists`,
        );
      }
    }
    Object.assign(competition, dto);
    return this.competitionRepo.save(competition);
  }

  async remove(id: number): Promise<void> {
    const competition = await this.findOne(id);
    await this.competitionRepo.remove(competition);
  }

  // ─── Stats (Admin Dashboard) ─────────────────────────────────────────────────

  async getStats(id: number): Promise<CompetitionStats> {
    await this.findOne(id);

    const raw = (await this.dataSource.query(
      `SELECT
        COUNT(*)::int                                                    AS total,
        COUNT(*) FILTER (WHERE status = 'approved')::int                 AS approved,
        COUNT(*) FILTER (WHERE status = 'submitted' OR status = 'under_review')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'rejected')::int                 AS rejected,
        COALESCE(SUM(amount) FILTER (WHERE payment_status = 'verified'), 0)::numeric AS revenue
       FROM registrations
       WHERE competition_id = $1`,
      [id],
    )) as unknown as CompetitionStats[];

    return raw[0];
  }

  // ─── Sub-Events (Admin) ──────────────────────────────────────────────────────

  async addEvent(
    competitionId: number,
    dto: CreateCompetitionEventDto,
  ): Promise<CompetitionEvent> {
    await this.findOne(competitionId);
    const event = this.eventRepo.create({
      ...dto,
      competition_id: competitionId,
    });
    return this.eventRepo.save(event);
  }

  async updateEvent(
    competitionId: number,
    eventId: number,
    dto: Partial<CreateCompetitionEventDto>,
  ): Promise<CompetitionEvent> {
    const event = await this.eventRepo.findOne({
      where: { id: eventId, competition_id: competitionId },
    });
    if (!event) throw new NotFoundException('Event not found');
    Object.assign(event, dto);
    return this.eventRepo.save(event);
  }

  async removeEvent(competitionId: number, eventId: number): Promise<void> {
    const event = await this.eventRepo.findOne({
      where: { id: eventId, competition_id: competitionId },
    });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventRepo.remove(event);
  }
}
