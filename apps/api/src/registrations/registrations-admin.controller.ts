import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Res,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { RegistrationsService } from './registrations.service.js';
import {
  ApproveRegistrationDto,
  RejectRegistrationDto,
  VerifyPaymentDto,
} from './dto/admin-registration.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RequirePermissions } from '../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { RegistrationStatus } from './entities/registration.entity.js';

interface AuthUser {
  id: number;
  email: string;
}

@Controller('admin/registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsAdminController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @RequirePermissions('competitions:read')
  @Get('competition/:competitionId')
  findAll(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Query('status') status?: RegistrationStatus,
  ) {
    return this.registrationsService.findAllByCompetition(
      competitionId,
      status,
    );
  }

  @RequirePermissions('competitions:read')
  @Get('competition/:competitionId/reports')
  getEventBreakdown(
    @Param('competitionId', ParseIntPipe) competitionId: number,
  ) {
    return this.registrationsService.getEventBreakdown(competitionId);
  }

  @RequirePermissions('competitions:read')
  @Get('competition/:competitionId/export')
  async exportCsv(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Res() res: Response,
  ) {
    const csv = await this.registrationsService.exportCsv(competitionId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=registrations_comp_${competitionId}_${new Date().toISOString().split('T')[0]}.csv`,
    );
    return res.end(csv);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/approve')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveRegistrationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.approve(id, user.id, dto.remarks);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectRegistrationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.failPayment(id, user.id, dto.reason);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/revoke')
  revoke(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.revoke(id, user.id);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/request-changes')
  requestChanges(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { feedback: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.requestChanges(id, user.id, dto.feedback);
  }

  @RequirePermissions('competitions:delete')
  @Delete(':id')
  deleteRegistration(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.registrationsService.delete(id);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/verify-payment')
  verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.verifyPayment(id, user.id, dto.remarks);
  }

  @RequirePermissions('competitions:update')
  @Patch(':id/fail-payment')
  failPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectRegistrationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.registrationsService.failPayment(id, user.id, dto.reason);
  }
}
