import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shooter } from './entities/shooter.entity.js';
import { CreateShooterProfileDto } from './dto/create-shooter-profile.dto.js';
import { ShooterClassification } from './entities/shooter-classification.entity.js';
import { CreateShooterClassificationDto } from './dto/create-shooter-classification.dto.js';
import { UpdateShooterClassificationDto } from './dto/update-shooter-classification.dto.js';

@Injectable()
export class ShootersService {
  constructor(
    @InjectRepository(Shooter)
    private readonly shootersRepository: Repository<Shooter>,
    @InjectRepository(ShooterClassification)
    private readonly classificationsRepository: Repository<ShooterClassification>,
  ) {}

  /**
   * Create or Update shooter profile for the current user
   */
  async createOrUpdateProfile(
    user: { id: number },
    createDto: CreateShooterProfileDto,
  ): Promise<Shooter> {
    let shooter = await this.shootersRepository.findOne({
      where: { user_id: user.id },
    });

    if (shooter) {
      if (
        shooter.registration_status === 'approved' ||
        shooter.registration_status === 'rejected'
      ) {
        shooter.registration_status = 'pending';
      }
      // needs_changes: allow editing without changing status (shooter resubmits via submitProfile)
      // Update existing
      this.shootersRepository.merge(shooter, createDto);
    } else {
      // Create new
      // We need to handle 'shooter_id' generation.
      // In a real app, strict generation logic is needed.
      // Here we rely on the DB trigger or generate one manually if trigger isn't reliable in TypeORM save.
      // However, the DB has a trigger `set_shooter_id` BEFORE INSERT.
      // So we can just save it.
      // Note: user_id is required.
      shooter = this.shootersRepository.create({
        ...createDto,
        date_of_birth: createDto.date_of_birth || '1970-01-01',
        gender: createDto.gender || 'other',
        user_id: user.id,
        profile_complete: true,
      });
    }

    return this.shootersRepository.save(shooter);
  }

  /**
   * Submit profile for admin review (incomplete → pending)
   */
  async submitProfile(userId: number): Promise<Shooter> {
    const shooter = await this.shootersRepository.findOne({
      where: { user_id: userId },
    });

    if (!shooter) {
      throw new Error(
        'Shooter profile not found. Please create a profile first.',
      );
    }

    if (
      shooter.registration_status !== 'incomplete' &&
      shooter.registration_status !== 'needs_changes'
    ) {
      throw new Error(
        `Profile has already been submitted (current status: ${shooter.registration_status}).`,
      );
    }

    shooter.registration_status = 'pending';
    shooter.admin_feedback = null; // clear previous feedback on resubmission
    return this.shootersRepository.save(shooter);
  }

  /**
   * Get public profile by shooter ID (e.g. PSCI-1001) or User ID
   */
  async findOne(id: number): Promise<Shooter> {
    const shooter = await this.shootersRepository.findOne({
      where: { id },
      relations: ['user', 'state_association'],
    });

    if (!shooter) {
      throw new NotFoundException(`Shooter not found`);
    }

    return shooter;
  }

  /**
   * Get profile by User ID
   */
  async findByUserId(userId: number): Promise<Shooter> {
    const shooter = await this.shootersRepository.findOne({
      where: { user_id: userId },
      relations: ['user', 'state_association'],
    });

    if (!shooter) {
      throw new NotFoundException('Shooter profile not found');
    }
    return shooter;
  }

  /**
   * Admin: Verify a shooter
   */
  async verifyShooter(id: number, adminId: number): Promise<Shooter> {
    const shooter = await this.findOne(id);
    shooter.verified_at = new Date();
    shooter.verified_by = adminId;
    return this.shootersRepository.save(shooter);
  }

  /**
   * Add a new classification to a shooter
   */
  async addClassification(
    shooterId: number,
    dto: CreateShooterClassificationDto,
  ): Promise<ShooterClassification> {
    await this.findOne(shooterId); // Ensure shooter exists

    // Deactivate previous active classifications for this shooter
    await this.classificationsRepository.update(
      { shooter_id: shooterId, is_current: true },
      { is_current: false },
    );

    const classification = this.classificationsRepository.create({
      ...dto,
      shooter_id: shooterId,
      is_current: true,
    });

    return this.classificationsRepository.save(classification);
  }

  /**
   * Update a classification
   */
  async updateClassification(
    id: number,
    dto: UpdateShooterClassificationDto,
  ): Promise<ShooterClassification> {
    const classification = await this.classificationsRepository.findOne({
      where: { id },
    });
    if (!classification) {
      throw new NotFoundException('Classification not found');
    }

    this.classificationsRepository.merge(classification, dto);
    return this.classificationsRepository.save(classification);
  }

  /**
   * Get classifications for a shooter
   */
  async getClassifications(
    shooterId: number,
  ): Promise<ShooterClassification[]> {
    return this.classificationsRepository.find({
      where: { shooter_id: shooterId },
      order: { created_at: 'DESC' },
      relations: ['disability_category'],
    });
  }

  // --- Admin Methods ---

  async getStatsAdmin() {
    const qb = this.shootersRepository.createQueryBuilder('s');
    const stats = await qb
      .select([
        'COUNT(*) as total',
        "COUNT(*) FILTER (WHERE s.registration_status = 'pending') as pending",
        "COUNT(*) FILTER (WHERE s.registration_status = 'approved') as approved",
        "COUNT(*) FILTER (WHERE s.registration_status = 'rejected') as rejected",
        "COUNT(*) FILTER (WHERE s.registration_status = 'needs_changes') as needs_changes",
      ])
      .getRawOne();

    return {
      total: Number(stats?.total || 0),
      pending: Number(stats?.pending || 0),
      approved: Number(stats?.approved || 0),
      rejected: Number(stats?.rejected || 0),
      needs_changes: Number(stats?.needs_changes || 0),
    };
  }

  async findAllAdmin(filters: any) {
    const qb = this.shootersRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'user')
      .leftJoinAndSelect('s.state_association', 'state')
      .orderBy('s.created_at', 'DESC');

    if (filters.status) {
      qb.andWhere('s.registration_status = :status', {
        status: filters.status,
      });
    }
    if (filters.state) {
      qb.andWhere('state.name = :st OR state.code = :st', {
        st: filters.state,
      });
    }
    if (filters.eventType) {
      qb.andWhere('s.event_type = :event', { event: filters.eventType });
    }
    if (filters.category) {
      qb.andWhere('s.category = :category', { category: filters.category });
    }
    if (filters.search) {
      qb.andWhere(
        '(s.pci_id ILIKE :search OR s.shooter_id ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const limit = filters.limit ? parseInt(filters.limit, 10) : 50;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    qb.take(limit).skip((page - 1) * limit);

    const [shooters, total] = await qb.getManyAndCount();
    return { shooters, total, page, limit };
  }

  async getNextPciIdAdmin() {
    const year = new Date().getFullYear();
    const qb = this.shootersRepository.createQueryBuilder('s');
    const result = await qb
      .select('s.pci_id')
      .where('s.pci_id LIKE :pattern', { pattern: `PCI/PSAI/${year}/%` })
      .orderBy('s.pci_id', 'DESC')
      .getRawOne();

    if (result && result.s_pci_id) {
      const parts = result.s_pci_id.split('/');
      const num = parseInt(parts[parts.length - 1], 10);
      const nextNum = (num + 1).toString().padStart(4, '0');
      return { suggested: `PCI/PSAI/${year}/${nextNum}` };
    }
    return { suggested: `PCI/PSAI/${year}/0001` };
  }

  async exportCsvAdmin(filters: any): Promise<string> {
    const { shooters } = await this.findAllAdmin({ ...filters, limit: 10000 });
    const header = [
      'Competitor No',
      'First Name',
      'Last Name',
      'State',
      'Email',
      'Contact',
      'Event Type',
      'Category',
      'PCI ID',
      'Registration Status',
      'Registered Date',
      'Approved Date',
    ].join(',');

    const rows = shooters.map((s) => {
      return [
        s.shooter_id || '',
        s.user?.first_name || '',
        s.user?.last_name || '',
        s.state_association?.name || '',
        s.user?.email || '',
        s.user?.phone || '',
        s.event_type || '',
        s.category || '',
        s.pci_id || '',
        s.registration_status || '',
        s.created_at ? s.created_at.toISOString().split('T')[0] : '',
        s.approved_at ? s.approved_at.toISOString().split('T')[0] : '',
      ]
        .map((field) => `"${(field || '').toString().replace(/"/g, '""')}"`)
        .join(',');
    });

    return [header, ...rows].join('\n');
  }

  async getDocumentsAdmin(id: number) {
    try {
      // 1. Get documents from the shooter_documents table
      const tableResults = await this.shootersRepository.query(
        'SELECT * FROM shooter_documents WHERE shooter_id = $1 ORDER BY document_type ASC',
        [id],
      );

      // 2. Also get document URLs stored directly on the shooter record
      const shooter = await this.shootersRepository.findOne({ where: { id } });
      const inlineDocuments: any[] = [];

      if (shooter) {
        const urlFields = [
          { field: 'photo_url', label: 'Profile Photo' },
          { field: 'signature_url', label: 'Specimen Signature' },
          { field: 'birth_certificate_url', label: 'Birth Certificate' },
          { field: 'aadhar_card_url', label: 'Aadhar Card' },
          { field: 'pan_card_url', label: 'PAN Card' },
          { field: 'passport_doc_url', label: 'Passport' },
          { field: 'arms_license_url', label: 'Arms License' },
          { field: 'affidavit_url', label: 'Affidavit' },
          { field: 'ipc_card_url', label: 'IPC Card' },
        ];

        for (const { field, label } of urlFields) {
          const url = (shooter as any)[field];
          if (url) {
            inlineDocuments.push({
              id: `inline-${field}`,
              shooter_id: id,
              document_type: label,
              file_url: url,
              file_name: label,
              source: 'profile',
            });
          }
        }
      }

      return [...inlineDocuments, ...(tableResults || [])];
    } catch (e) {
      return [];
    }
  }

  async approveAdmin(id: number, approvedBy: number) {
    const shooter = await this.findOne(id);
    shooter.registration_status = 'approved';
    shooter.approved_by = approvedBy;
    shooter.approved_at = new Date();
    return this.shootersRepository.save(shooter);
  }

  async rejectAdmin(
    id: number,
    reason: string,
    notes?: string,
    adminId?: number,
  ) {
    const shooter = await this.findOne(id);
    shooter.registration_status = 'rejected';
    shooter.rejection_reason = reason + (notes ? ` - ${notes}` : '');
    shooter.approved_by = adminId ?? null;
    shooter.approved_at = new Date();
    return this.shootersRepository.save(shooter);
  }

  async assignPciIdAdmin(id: number, pciId: string) {
    const shooter = await this.findOne(id);
    shooter.pci_id = pciId;
    return this.shootersRepository.save(shooter);
  }

  async requestChangesAdmin(id: number, feedback: string, adminId?: number) {
    const shooter = await this.findOne(id);
    if (shooter.registration_status === 'rejected') {
      throw new Error('Cannot request changes on a finally rejected application.');
    }
    shooter.registration_status = 'needs_changes';
    shooter.admin_feedback = feedback;
    shooter.approved_by = adminId ?? null;
    return this.shootersRepository.save(shooter);
  }

  async revokeApprovalAdmin(id: number, reason: string) {
    const shooter = await this.findOne(id);
    shooter.registration_status = 'pending';
    shooter.rejection_reason = reason;
    return this.shootersRepository.save(shooter);
  }

  async removeAdmin(id: number) {
    return this.shootersRepository.delete(id);
  }
}
