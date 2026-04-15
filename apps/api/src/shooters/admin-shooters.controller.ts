import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ShootersService } from './shooters.service.js';
import {
  ApproveDto,
  RejectDto,
  AssignPciIdDto,
  RevokeDto,
  RequestChangesDto,
  ShooterFiltersDto,
} from './dto/admin-shooter.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AuditService } from '../common/services/audit.service.js';
import { AuditAction } from '../common/entities/audit-log.entity.js';

interface AuthenticatedUser {
  id: number;
  email: string;
}

@Controller('admin/shooters')
@UseGuards(JwtAuthGuard)
export class AdminShootersController {
  constructor(
    private readonly shootersService: ShootersService,
    private readonly auditService: AuditService,
  ) {}

  @RequirePermissions('shooters:read')
  @Get()
  async findAll(@Query() filters: ShooterFiltersDto) {
    return this.shootersService.findAllAdmin(filters);
  }

  @RequirePermissions('shooters:read')
  @Get('stats')
  async getStats() {
    return this.shootersService.getStatsAdmin();
  }

  @RequirePermissions('shooters:read')
  @Get('next-pci-id')
  async getNextPciId() {
    return this.shootersService.getNextPciIdAdmin();
  }

  @RequirePermissions('shooters:read')
  @Get('export')
  async exportCsv(@Query() filters: ShooterFiltersDto, @Res() res: Response) {
    const csvData = await this.shootersService.exportCsvAdmin(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=PSAI_Shooters_${filters.status || 'All'}_${new Date().toISOString().split('T')[0]}.csv`,
    );

    return res.end(csvData);
  }

  @RequirePermissions('shooters:read')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shootersService.findOne(+id);
  }

  @RequirePermissions('shooters:read')
  @Get(':id/documents')
  async getDocuments(@Param('id') id: string) {
    return this.shootersService.getDocumentsAdmin(+id);
  }

  @RequirePermissions('shooters:read')
  @Get(':id/classification')
  async getClassification(@Param('id') id: string) {
    return this.shootersService.getClassifications(+id);
  }

  @RequirePermissions('shooters:verify')
  @Patch(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.approveAdmin(
      +id,
      dto?.approved_by || user.id,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'shooter',
      recordId: +id,
      newValues: { registration_status: 'approved', approved_at: new Date() },
    });

    return result;
  }

  @RequirePermissions('shooters:verify')
  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.rejectAdmin(
      +id,
      dto.reason,
      dto.notes,
      dto.rejected_by || user.id,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'shooter',
      recordId: +id,
      newValues: {
        registration_status: 'rejected',
        rejection_reason: dto.reason,
      },
    });

    return result;
  }

  @RequirePermissions('shooters:verify')
  @Patch(':id/assign-pci-id')
  async assignPciId(
    @Param('id') id: string,
    @Body() dto: AssignPciIdDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.assignPciIdAdmin(+id, dto.pciId);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'shooter',
      recordId: +id,
      newValues: { pci_id: dto.pciId },
    });

    return result;
  }

  @RequirePermissions('shooters:verify')
  @Patch(':id/request-changes')
  async requestChanges(
    @Param('id') id: string,
    @Body() dto: RequestChangesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.requestChangesAdmin(
      +id,
      dto.feedback,
      dto.admin_id || user.id,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'shooter',
      recordId: +id,
      newValues: {
        registration_status: 'needs_changes',
        admin_feedback: dto.feedback,
      },
    });

    return result;
  }

  @RequirePermissions('shooters:verify')
  @Patch(':id/revoke')
  async revokeApproval(
    @Param('id') id: string,
    @Body() dto: RevokeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.revokeApprovalAdmin(
      +id,
      dto.reason,
    );

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.UPDATE,
      tableName: 'shooter',
      recordId: +id,
      newValues: {
        registration_status: 'pending',
        rejection_reason: dto.reason,
      },
    });

    return result;
  }

  @RequirePermissions('shooters:delete')
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.shootersService.removeAdmin(+id);

    await this.auditService.log({
      userId: user.id,
      action: AuditAction.DELETE,
      tableName: 'shooter',
      recordId: +id,
    });

    return result;
  }
}
