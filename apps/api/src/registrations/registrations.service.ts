import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Registration,
  RegistrationStatus,
  PaymentStatus,
} from './entities/registration.entity.js';
import { RegistrationEvent } from './entities/registration-event.entity.js';
import { Competition } from '../competitions/entities/competition.entity.js';
import { CompetitionEvent } from '../competitions/entities/competition-event.entity.js';
import { Shooter } from '../shooters/entities/shooter.entity.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { CompetitionNumberService } from '../competitions/competition-number.service.js';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    @InjectRepository(RegistrationEvent)
    private readonly regEventRepo: Repository<RegistrationEvent>,
    @InjectRepository(Competition)
    private readonly competitionRepo: Repository<Competition>,
    @InjectRepository(CompetitionEvent)
    private readonly compEventRepo: Repository<CompetitionEvent>,
    @InjectRepository(Shooter)
    private readonly shooterRepo: Repository<Shooter>,
    private readonly dataSource: DataSource,
    private readonly numberService: CompetitionNumberService,
  ) {}

  // ─── Shooter: Create Registration ────────────────────────────────────────────

  async create(
    userId: number,
    dto: CreateRegistrationDto,
  ): Promise<Registration> {
    if (!dto.terms_accepted) {
      throw new BadRequestException('You must accept the terms and conditions');
    }

    // Resolve shooter from user
    const shooter = await this.shooterRepo.findOne({
      where: { user_id: userId },
    });
    if (!shooter)
      throw new NotFoundException(
        'Shooter profile not found. Please complete your profile first.',
      );

    // Validate competition
    const competition = await this.competitionRepo.findOne({
      where: { id: dto.competition_id, is_active: true },
    });
    if (!competition)
      throw new NotFoundException('Competition not found or is not active');

    // Check for duplicate registration
    const exists = await this.registrationRepo.findOne({
      where: { competition_id: dto.competition_id, shooter_id: shooter.id },
    });
    if (exists)
      throw new ConflictException(
        'You are already registered for this competition',
      );

    // Resolve the events and calculate total fee
    const events = await this.compEventRepo.findByIds(dto.event_ids);
    if (events.length === 0)
      throw new BadRequestException('No valid events selected');

    const wrongCompEvents = events.filter(
      (e) => Number(e.competition_id) !== Number(dto.competition_id),
    );
    if (wrongCompEvents.length > 0) {
      throw new BadRequestException(
        'One or more events do not belong to this competition',
      );
    }

    const totalAmount = events.reduce((sum, e) => sum + Number(e.fee), 0);

    // Transactionally create registration + events
    return this.dataSource.transaction(async (manager) => {
      const registration = manager.create(Registration, {
        competition_id: dto.competition_id,
        shooter_id: shooter.id,
        payment_method: dto.payment_method,
        transaction_id: dto.transaction_id ?? null,
        payment_proof_url: dto.payment_proof_url ?? null,
        terms_accepted: dto.terms_accepted,
        amount: totalAmount,
        status: RegistrationStatus.SUBMITTED,
        payment_status: dto.payment_proof_url
          ? PaymentStatus.UPLOADED
          : PaymentStatus.PENDING,
      });
      const saved = await manager.save(Registration, registration);

      const regEvents = events.map((e) =>
        manager.create(RegistrationEvent, {
          registration_id: saved.id,
          competition_event_id: e.id,
          event_name_snapshot: e.event_name,
          fee_snapshot: e.fee,
        }),
      );
      await manager.save(RegistrationEvent, regEvents);

      return saved;
    });
  }

  // ─── Shooter: View Own Registrations ─────────────────────────────────────────

  async findMyRegistrations(userId: number): Promise<Registration[]> {
    const shooter = await this.shooterRepo.findOne({
      where: { user_id: userId },
    });
    if (!shooter) return [];

    return this.registrationRepo.find({
      where: { shooter_id: shooter.id },
      relations: [
        'competition',
        'registration_events',
        'registration_events.competition_event',
      ],
      order: { created_at: 'DESC' },
    });
  }

  // ─── Admin: List registrations for a competition ──────────────────────────────

  async findAllByCompetition(
    competitionId: number,
    status?: RegistrationStatus,
  ): Promise<Registration[]> {
    const where: any = { competition_id: competitionId };
    if (status) where.status = status;

    return this.registrationRepo.find({
      where,
      relations: [
        'shooter',
        'shooter.user',
        'shooter.state_association',
        'registration_events',
        'registration_events.competition_event',
      ],
      order: { created_at: 'DESC' },
    });
  }

  // ─── Admin: Approve ───────────────────────────────────────────────────────────

  async approve(
    registrationId: number,
    adminId: number,
    remarks?: string,
  ): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
      relations: ['competition'],
    });
    if (!registration) throw new NotFoundException('Registration not found');

    if (registration.status === RegistrationStatus.APPROVED) {
      throw new ConflictException('Registration is already approved');
    }

    // Atomically mint the competition number
    const compNo = await this.numberService.mint(
      registration.competition_id,
      registration.competition.code,
    );

    registration.status = RegistrationStatus.APPROVED;
    registration.competition_no = compNo;
    if (remarks) registration.remarks = remarks;

    return this.registrationRepo.save(registration);
  }

  // ─── Admin: Request Changes ───────────────────────────────────────────────────

  async requestChanges(
    registrationId: number,
    adminId: number,
    feedback: string,
  ): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    registration.status = RegistrationStatus.UNDER_REVIEW;
    registration.remarks = feedback;

    return this.registrationRepo.save(registration);
  }

  // ─── Admin: Revoke ────────────────────────────────────────────────────────────

  async revoke(
    registrationId: number,
    adminId: number,
  ): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    registration.status = RegistrationStatus.UNDER_REVIEW;
    registration.remarks = 'Approval revoked by admin. ' + (registration.remarks || '');
    // Note: Do we un-assign competition_no? Let's leave it, since it's already minted,
    // or we can nullify it. We prefer not to break constraints.
    
    return this.registrationRepo.save(registration);
  }

  // ─── Admin: Delete ────────────────────────────────────────────────────────────

  async delete(registrationId: number): Promise<void> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    await this.registrationRepo.remove(registration);
  }


  // ─── Admin: Verify Payment ────────────────────────────────────────────────────

  async verifyPayment(
    registrationId: number,
    adminId: number,
    remarks?: string,
  ): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    registration.payment_status = PaymentStatus.VERIFIED;
    registration.payment_verified_by = adminId;
    registration.payment_verified_at = new Date();
    if (remarks) registration.remarks = remarks;

    return this.registrationRepo.save(registration);
  }

  async failPayment(
    registrationId: number,
    adminId: number,
    reason: string,
  ): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id: registrationId },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    registration.payment_status = PaymentStatus.FAILED;
    registration.remarks = reason;

    return this.registrationRepo.save(registration);
  }

  // ─── Admin: Reports ───────────────────────────────────────────────────────────

  async getEventBreakdown(competitionId: number) {
    return this.dataSource.query(
      `SELECT
        ce.event_no,
        ce.event_name,
        COUNT(re.id)::int            AS participant_count,
        COALESCE(SUM(re.fee_snapshot), 0)::numeric AS total_fees
       FROM competition_events ce
       LEFT JOIN registration_events re ON re.competition_event_id = ce.id
       LEFT JOIN registrations r ON r.id = re.registration_id AND r.status = 'approved'
       WHERE ce.competition_id = $1
       GROUP BY ce.id, ce.event_no, ce.event_name
       ORDER BY ce.event_no`,
      [competitionId],
    );
  }

  // ─── Admin: Export CSV ────────────────────────────────────────────────────────

  async exportCsv(competitionId: number): Promise<string> {
    const registrations = await this.findAllByCompetition(competitionId);
    const header =
      'Comp No,Shooter Name,State,Events,Amount,Payment Status,Status\n';
    const rows = registrations.map((r) => {
      const name = r.shooter?.user
        ? `${r.shooter.user['first_name'] ?? ''} ${r.shooter.user['last_name'] ?? ''}`.trim()
        : String(r.shooter_id);
      const events =
        r.registration_events?.map((re) => re.event_name_snapshot).join('; ') ??
        '';
      const state = r.shooter?.state_association?.['name'] ?? '';
      return [
        r.competition_no ?? '',
        name,
        state,
        events,
        r.amount,
        r.payment_status,
        r.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',');
    });
    return header + rows.join('\n');
  }
}
