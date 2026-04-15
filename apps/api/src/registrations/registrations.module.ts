import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/registration.entity.js';
import { RegistrationEvent } from './entities/registration-event.entity.js';
import { Competition } from '../competitions/entities/competition.entity.js';
import { CompetitionEvent } from '../competitions/entities/competition-event.entity.js';
import { Shooter } from '../shooters/entities/shooter.entity.js';
import { RegistrationsService } from './registrations.service.js';
import { RegistrationsController } from './registrations.controller.js';
import { RegistrationsAdminController } from './registrations-admin.controller.js';
import { CompetitionsModule } from '../competitions/competitions.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Registration,
      RegistrationEvent,
      Competition,
      CompetitionEvent,
      Shooter,
    ]),
    CompetitionsModule, // provides CompetitionNumberService
  ],
  controllers: [RegistrationsController, RegistrationsAdminController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
