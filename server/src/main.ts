import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/http/filters/http-exception.filter';

// APP MIDDLEWARES
import helmet from 'helmet';
import * as morgan from 'morgan';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(morgan('tiny'));
  app.use(helmet());
  app.use(json({ strict: false }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(+configService.get('PORT') || 3000);
}
bootstrap();
