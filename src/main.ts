import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { RequestLoggingInterceptor } from './logging/request-logging.interceptor';
import { GlobalExceptionHandler } from './exceptions/global-exception-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, context, message }) =>
            `[${timestamp}] [${level}] [${context}] ${message}`,
        ),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.ms(),
            utilities.format.nestLike('Insurance Company', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
        }),
      ],
      level: 'debug',
    }),
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  app.useGlobalFilters(new GlobalExceptionHandler());

  const config = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription('Backend for insurance company')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
