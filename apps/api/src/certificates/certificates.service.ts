import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import archiver = require('archiver');
import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';

export interface GenerateOptions {
  mode: 'all' | 'pending' | 'specific' | 'regenerate';
  athleteIds?: string[];
  sendEmail: boolean;
  makePublic: boolean;
  includeQr: boolean;
  watermarkTime?: boolean;
}

export interface LogEntry {
  id: number;
  time: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

export interface GenerationProgress {
  total: number;
  completed: number;
  errors: number;
  currentAthlete: string;
  percentComplete: number;
  estimatedSecondsRemaining: number;
  logs: LogEntry[];
}

export interface GenerationResult {
  completed: number;
  errors: number;
  totalSizeMb: number;
  elapsedSeconds: number;
  failedAthletes: Array<{ id: string; name: string; reason: string }>;
}

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  // Nodemailer transporter (Configure with your SMTP details in production)
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'user',
      pass: process.env.SMTP_PASS || 'pass',
    },
  });

  /**
   * Main bulk generation method
   */
  async generateBulkCertificates(
    competitionId: string,
    options: GenerateOptions,
    progressCallback: (progress: GenerationProgress) => void,
  ): Promise<GenerationResult> {
    this.logger.log(
      `Starting bulk generation for competition ${competitionId} (Mode: ${options.mode})`,
    );

    // 1. Fetch relevant athletes from dummy or real DB based on 'options.mode'
    // For demonstration, we simulate fetching 275 athletes.
    const athletesToProcess = Array.from({ length: 275 }, (_, i) => ({
      id: `ATH-${i}`,
      name: `Athlete ${i}`,
      email: `athlete${i}@example.com`,
    }));

    const total = athletesToProcess.length;
    let completed = 0;
    let errors = 0;
    const logs: LogEntry[] = [];
    const failedAthletes = [];
    const startTime = Date.now();

    for (let i = 0; i < total; i++) {
      const athlete = athletesToProcess[i];
      try {
        // 2. Generate PDF via CertificatePdfService or similar logic
        // Fake delay representing Puppeteer rendering
        await new Promise((resolve) => setTimeout(resolve, 150));

        completed++;

        // Add success log
        logs.push({
          id: Date.now() + i,
          time: new Date().toISOString(),
          type: 'success',
          message: `✅ ${athlete.name} — generated PDF (${Math.floor(Math.random() * 50) + 120}KB)`,
        });
      } catch (err) {
        errors++;
        failedAthletes.push({
          id: athlete.id,
          name: athlete.name,
          reason: (err as Error).message || 'Unknown error',
        });
        logs.push({
          id: Date.now() + i,
          time: new Date().toISOString(),
          type: 'error',
          message: `❌ Failed to generate for ${athlete.name}: ${(err as Error).message}`,
        });
      }

      // 3. Fire progress callback periodically or per-item
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = completed / elapsed; // items per sec
      const remainingSeconds = rate > 0 ? (total - completed) / rate : 0;

      progressCallback({
        total,
        completed,
        errors,
        currentAthlete: athlete.name,
        percentComplete: Math.round((completed / total) * 100),
        estimatedSecondsRemaining: Math.round(remainingSeconds),
        logs: logs.slice(-5), // Just send latest 5 logs to stream to save bandwidth
      });
    }

    const elapsedSeconds = (Date.now() - startTime) / 1000;

    // Simulate total size (140KB per PDF avg)
    const totalSizeMb = (completed * 140) / 1024;

    return {
      completed,
      errors,
      totalSizeMb: parseFloat(totalSizeMb.toFixed(2)),
      elapsedSeconds: Math.round(elapsedSeconds),
      failedAthletes,
    };
  }

  /**
   * Generate single certificate
   */
  async generateSingleCertificate(
    entryId: string,
  ): Promise<{ pdfBuffer: Buffer; certNo: string }> {
    this.logger.log(`Generating single certificate for ${entryId}`);
    // Example: call Puppeteer template service, return buffer
    return {
      pdfBuffer: Buffer.from('%PDF-1.4... fake pdf content ...'),
      certNo: `CERT-${entryId}`,
    };
  }

  /**
   * SSE Endpoint helper logic (Streams progress to Controller)
   */
  async streamGenerationProgress(
    competitionId: string,
    progressSubject: Subject<{ data: GenerationProgress }>,
  ): Promise<void> {
    // The controller subscribes to `progressSubject`.
    // We would link this Subject to the ongoing generation task for this `competitionId`.
    this.logger.log(`Listening to progress for ${competitionId}`);
  }

  /**
   * ZIP all PDFs for a competition using Archiver
   */
  async createCertificatesZip(competitionId: string): Promise<Buffer> {
    this.logger.log(`Creating ZIP for competition ${competitionId}`);
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      const bufs: Buffer[] = [];
      archive.on('data', (data: any) => bufs.push(data));
      archive.on('error', (err: any) => reject(err));
      archive.on('end', () => resolve(Buffer.concat(bufs)));

      // In production, we would either read from an S3 bucket or local /uploads dir
      // Simulated append:
      archive.append(Buffer.from('%PDF-1.4 dummy cert 1'), {
        name: 'athlete_1_cert.pdf',
      });
      archive.append(Buffer.from('%PDF-1.4 dummy cert 2'), {
        name: 'athlete_2_cert.pdf',
      });

      void archive.finalize();
    });
  }

  /**
   * Email certificate to shooter
   */
  async emailCertificate(
    entryId: string,
    emailOverride?: string,
  ): Promise<void> {
    const targetEmail = emailOverride || `athlete_${entryId}@example.com`;
    const certPdf = Buffer.from('%PDF-1.4 dummy attachment buffer'); // Would be generated dynamically

    this.logger.log(`Sending certificate email to ${targetEmail}`);

    // Nodemailer Email Template
    const templateHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003087;">Paralympic Committee of India</h2>
        <p>Dear Athlete,</p>
        <p>Congratulations on your participation and achievements at the National Para Shooting Championship.</p>
        <p>Your official digital certificate of merit is attached to this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>PSAI Administration Office</strong></p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: '"PSAI Admin" <noreply@psai.in>',
        to: targetEmail,
        subject: 'Your Official PSAI Certificate of Merit',
        html: templateHTML,
        attachments: [
          {
            filename: `PSAI_Certificate_${entryId}.pdf`,
            content: certPdf,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error('Failed to send certificate email', error);
      throw error;
    }
  }
}
