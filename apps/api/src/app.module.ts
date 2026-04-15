import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StatesModule } from './states/states.module.js';
import { DisabilityCategoriesModule } from './disability-categories/disability-categories.module.js';
import { VenuesModule } from './venues/venues.module.js';
import { ShootersModule } from './shooters/shooters.module.js';
import { ResultsModule } from './results/results.module.js';
import { NewsModule } from './news/news.module.js';
import { UploadModule } from './upload/upload.module.js';
import { EventsModule } from './events/events.module.js';
import { MediaModule } from './media/media.module.js';
import { DownloadsModule } from './downloads/downloads.module';
import { CategoriesModule } from './categories/categories.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuditLog } from './common/entities/audit-log.entity.js';
import { AuditService } from './common/services/audit.service.js';
import { EncryptionService } from './common/services/encryption.service.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { Role } from './auth/entities/role.entity.js';
import { UserRole } from './auth/entities/user-role.entity.js';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import { LoggerModule } from './common/logger/logger.module';
<<<<<<< Updated upstream
import { CompetitionsModule } from './competitions/competitions.module';
import { RegistrationsModule } from './registrations/registrations.module';
=======
>>>>>>> Stashed changes

// Disable ServeStaticModule in production (Render, Vercel, or NODE_ENV=production)
// On Render, RENDER_EXTERNAL_URL is always set (e.g., https://yourapp.onrender.com)
// However, since we are deploying to a VPS (Droplet) with local disk storage,
// we NEED to enable static file serving for uploads even in production.
const isProduction = false; // Forced to false to enable static file serving for VPS deployment

/*
const isProduction =
  !!process.env.VERCEL ||
  !!process.env.RENDER_EXTERNAL_URL;
*/

const uploadServeStaticModules = isProduction
  ? []
  : [
      // Serve General Uploads (Documents, Profiles, etc.)
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
        serveStaticOptions: {
          index: false,
        },
      }),
      // Serve Uploads via API prefix (for frontend access)
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/api/v1/uploads',
        serveStaticOptions: {
          index: false,
        },
      }),
      // Serve Uploaded Results
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'uploads', 'results'),
        serveRoot: '/uploads/results',
        serveStaticOptions: {
          index: false,
        },
      }),
    ];

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
      validationSchema: envValidationSchema,
    }),

    // Rate Limiting - Multi-tier strategy for 40k peak users
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 100, // Increased to 100 req/sec to prevent dev blockers
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 1000, // Increased to 1000 req/min
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 5000, // Increased to 5000 req/15min
      },
    ]),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Register entities for audit and permissions
    TypeOrmModule.forFeature([AuditLog, Role, UserRole]),

    // Feature Modules
    HealthModule,
    UsersModule,
    AuthModule,
    StatesModule,
    DisabilityCategoriesModule,
    VenuesModule,
    ShootersModule,
    ResultsModule,
    NewsModule,
    UploadModule,
    EventsModule,
    MediaModule,
    DownloadsModule,
    CategoriesModule,
    LoggerModule,

    // Serve Static Files (Frontend) - Disabled for Dev Split Mode
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../web/out'),
    //   exclude: ['/api/(.*)'],
    // }),

    // Only serve uploads from disk in development environment
    // In production (Render/Vercel), we use database storage and memory storage
    ...uploadServeStaticModules,
<<<<<<< Updated upstream

    CompetitionsModule,
    RegistrationsModule,
=======
>>>>>>> Stashed changes
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuditService,
    EncryptionService,
    // Global JWT Guard - all routes require authentication by default
    // Use @Public() decorator to make routes public
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global Permissions Guard
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global Audit Logging (Temporarily disabled due to constraint error)
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuditInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
