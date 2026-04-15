import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  fromBuffer as fileTypeFromBuffer,
  fromFile as fileTypeFromFile,
} from 'file-type';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  multerConfig,
  profilePictureConfig,
  documentConfig,
} from '../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { StoredFile } from './entities/stored-file.entity';

@Controller('upload')
export class UploadController {
  constructor(
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  /**
   * Helper to handle storage (Disk or DB)
   */
  private async saveFile(
    file: Express.Multer.File,
    subfolder = '',
  ): Promise<{ url: string; filename: string }> {
    const baseUrl =
      process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || '';

    // Validate magic bytes
    let actualType: { mime: string } | undefined;
    if (file.buffer) {
      const typeStr = (await fileTypeFromBuffer(file.buffer)) as
        | { mime: string }
        | undefined;
      actualType = typeStr ? { mime: typeStr.mime } : undefined;
    } else if (file.path) {
      const typeStr = (await fileTypeFromFile(file.path)) as
        | { mime: string }
        | undefined;
      actualType = typeStr ? { mime: typeStr.mime } : undefined;
    }

    const isTextFile = ['text/plain', 'text/csv'].includes(file.mimetype);

    // Reject binaries that are missing signatures
    if (!actualType && !isTextFile) {
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new BadRequestException(
        'Security violation: Ambiguous file signature.',
      );
    }

    // Reject confirmed dangerous signatures
    if (
      actualType &&
      !actualType.mime.includes('image/') &&
      !actualType.mime.includes('pdf') &&
      !actualType.mime.includes('document') &&
      !actualType.mime.includes('excel') &&
      !actualType.mime.includes('msword')
    ) {
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new BadRequestException(
        `Security violation: Detected disallowed file signature (${actualType.mime}).`,
      );
    }

    if (file.buffer) {
      // Memory Storage (production) -> Save to DB
      try {
        const storedFile = this.filesRepository.create({
          filename: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          originalName: file.originalname,
          mimetype: file.mimetype,
          data: file.buffer,
          size: file.size,
        });
        const savedFile = await this.filesRepository.save(storedFile);
        if (!savedFile || !savedFile.filename) {
          throw new Error('Failed to save file to database');
        }
        return {
          url: `${baseUrl}/api/v1/upload/view/${savedFile.filename}`,
          filename: savedFile.filename,
        };
      } catch (error) {
        throw new BadRequestException(
          `Failed to save file to database: ${(error as Error).message}`,
        );
      }
    } else {
      // Disk Storage (Local Dev)
      const diskUrl = `${baseUrl}/api/v1/uploads/${subfolder ? subfolder + '/' : ''}${file.filename}`;
      return {
        url: diskUrl,
        filename: file.filename,
      };
    }
  }

  /**
   * Serve file from DB (Public access)
   */
  @Public()
  @Get('view/:filename')
  async viewFile(@Param('filename') filename: string, @Res() res: Response) {
    console.log(`[viewFile] Attempting to retrieve file: ${filename}`);

    const file = await this.filesRepository.findOne({ where: { filename } });

    if (!file) {
      console.log(`[viewFile] File not found in database: ${filename}`);
      throw new NotFoundException('File not found');
    }

    console.log(
      `[viewFile] File found, serving: ${filename} (${file.mimetype}, ${file.size} bytes)`,
    );

    res.set({
      'Content-Type': file.mimetype,
      'Content-Length': file.size,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });

    res.send(file.data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('file')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { url, filename } = await this.saveFile(file);

    return {
      message: 'File uploaded successfully',
      file: {
        filename: filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path || 'db-stored',
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url, filename } = await this.saveFile(file);
        return {
          filename: filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: url,
        };
      }),
    );

    return {
      message: `${files.length} files uploaded successfully`,
      files: uploadedFiles,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture', profilePictureConfig))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No profile picture uploaded');
    }

    const { url, filename } = await this.saveFile(file, 'profiles');

    return {
      message: 'Profile picture uploaded successfully',
      file: {
        filename: filename,
        size: file.size,
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment-proof')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadPaymentProof(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No payment proof file uploaded');
    }

    const { url, filename } = await this.saveFile(file, 'payment-proofs');

    return {
      message: 'Payment proof uploaded successfully',
      url,
      filename,
      file: {
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('document')
  @UseInterceptors(FileInterceptor('document', documentConfig))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No document uploaded');
    }

    const { url, filename } = await this.saveFile(file, 'documents');

    return {
      message: 'Document uploaded successfully',
      file: {
        filename: filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('documents')
  @UseInterceptors(FilesInterceptor('documents', 5, documentConfig))
  async uploadDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No documents uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url, filename } = await this.saveFile(file, 'documents');
        return {
          filename: filename,
          originalName: file.originalname,
          size: file.size,
          url: url,
        };
      }),
    );

    return {
      message: `${files.length} documents uploaded successfully`,
      files: uploadedFiles,
    };
  }
}
