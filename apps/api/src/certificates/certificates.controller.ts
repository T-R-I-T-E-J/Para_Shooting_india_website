import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Sse,
  MessageEvent,
  Res,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CertificatesService,
  GenerateOptions,
  GenerationProgress,
} from './certificates.service';
// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../common/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';
// import { UseGuards } from '@nestjs/common';

@Controller('admin/competitions/:id/certificates')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin', 'super_admin')
export class CertificatesController {
  private readonly logger = new Logger(CertificatesController.name);

  // A map linking competition ID to an RxJs subject for Server-Sent Events (SSE)
  private readonly progressMap = new Map<
    string,
    Subject<{ data: GenerationProgress }>
  >();

  constructor(private readonly certificatesService: CertificatesService) {}

  /**
   * 1. Trigger Bulk Generation
   */
  @Post('generate')
  async generateBulk(
    @Param('id') competitionId: string,
    @Body() options: GenerateOptions,
  ) {
    this.logger.log(
      `Starting bulk generation for competition ${competitionId}`,
    );

    // Initialize stream subject if missing
    if (!this.progressMap.has(competitionId)) {
      this.progressMap.set(
        competitionId,
        new Subject<{ data: GenerationProgress }>(),
      );
    }

    const subject = this.progressMap.get(competitionId);

    // Run the generation asynchronously (don't block the request)
    // The client will get a 202 Accepted immediately and then subscribe to the SSE endpoint to watch progress
    setTimeout(async () => {
      try {
        const result = await this.certificatesService.generateBulkCertificates(
          competitionId,
          options,
          (progress) => {
            subject?.next({ data: progress });
          },
        );
        this.logger.log(`Generation Completed: ${JSON.stringify(result)}`);

        // Final event to signal completion
        subject?.next({
          data: {
            total: result.completed + result.errors,
            completed: result.completed,
            errors: result.errors,
            percentComplete: 100,
            currentAthlete: 'COMPLETED',
            estimatedSecondsRemaining: 0,
            logs: [
              {
                id: Date.now(),
                time: new Date().toISOString(),
                type: 'success',
                message: '✅ Execution Complete',
              },
            ],
          },
        });

        subject?.complete();
        this.progressMap.delete(competitionId);
      } catch (error) {
        this.logger.error('Bulk generation failed', error.stack);
        subject?.error(error);
      }
    }, 0);

    return { message: 'Certificate generation task queued', competitionId };
  }

  /**
   * 2. SSE Stream: Real-time progress tracker for the React UI
   */
  @Sse('progress')
  streamProgress(@Param('id') competitionId: string): Observable<MessageEvent> {
    this.logger.log(`Client subscribed to ${competitionId} SSE stream`);

    if (!this.progressMap.has(competitionId)) {
      // Return observable that completes immediately if task isn't running
      return new Observable<MessageEvent>((subscriber) =>
        subscriber.complete(),
      );
    }

    const subject = this.progressMap.get(competitionId);
    if (!subject)
      return new Observable<MessageEvent>((subscriber) =>
        subscriber.complete(),
      );

    // Convert subject events to SSE MessageEvents
    return subject.asObservable().pipe(
      map((payload: any) => ({
        data: payload.data,
      })),
    );
  }

  /**
   * 3. Download All as ZIP
   */
  @Get('download-all')
  async downloadZip(
    @Param('id') competitionId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    this.logger.log(`Downloading ZIP for ${competitionId}`);

    const zipBuffer =
      await this.certificatesService.createCertificatesZip(competitionId);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="PSAI_Certificates_${competitionId}.zip"`,
      'Content-Length': zipBuffer.length,
    });

    return new StreamableFile(zipBuffer);
  }

  /**
   * 4. Trigger Email notification for all athletes
   */
  @Post('email-all')
  async emailAll(
    @Param('id') competitionId: string,
    @Body('athleteIds') athleteIds: string[],
  ) {
    this.logger.log(`Triggering bulk email for competition ${competitionId}`);

    let sent = 0;
    // Iterate and send mail
    // Real implementation would queue jobs on Bull or RabbitMQ to avoid blocking
    for (const athleteId of athleteIds || ['mock-id-1', 'mock-id-2']) {
      await this.certificatesService.emailCertificate(athleteId);
      sent++;
    }

    return { message: `Successfully queued ${sent} emails` };
  }

  /**
   * 5. Download strictly a single certificate PDF
   */
  @Get(':entryId/download')
  async downloadSingle(
    @Param('id') competitionId: string,
    @Param('entryId') entryId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { pdfBuffer, certNo } =
      await this.certificatesService.generateSingleCertificate(entryId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${certNo}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    return new StreamableFile(pdfBuffer);
  }
}
