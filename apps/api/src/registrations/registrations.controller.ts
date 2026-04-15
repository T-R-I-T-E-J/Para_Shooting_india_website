import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

interface AuthUser {
  id: number;
  email: string;
}

@Controller('registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(user.id, dto);
  }

  @Get('my')
  findMine(@CurrentUser() user: AuthUser) {
    return this.registrationsService.findMyRegistrations(user.id);
  }
}
