import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { configureApp } from './setup';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = new Logger('Bootstrap');

  const { port, apiPrefix, corsOrigin, environment } = configureApp(app);

  logger.log(`🔒 Security headers enabled for: ${environment}`);
  logger.log('🛡️ Express rate limiting enabled (100 req/15min per IP)');

  if (environment === 'production' || environment === 'prod') {
    logger.log('🔐 Trust proxy enabled for production');
  }

  await app.listen(port, '0.0.0.0');

  logger.log(
    `🚀 Para Shooting Committee API is running on: http://0.0.0.0:${port}/${apiPrefix}`,
  );
  logger.log(`📊 Health check: http://0.0.0.0:${port}/${apiPrefix}/health`);
  logger.log(`🌍 Environment: ${environment}`);
  logger.log(`🔗 CORS enabled for: ${corsOrigin}`);
  logger.log(`📁 Uploads directory: ${process.cwd()}/uploads`);
}

void bootstrap();
