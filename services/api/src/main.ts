import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 4000);
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  const appUrl = configService.get<string>('appUrl', 'http://localhost:3001');

  // Security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    })
  );

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [
      appUrl,
      'http://localhost:3000',
      ...(nodeEnv === 'production'
        ? ['https://diamondfactory.in', 'https://www.diamondfactory.in']
        : []),
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API prefix
  app.setGlobalPrefix('api/v1', {
    exclude: ['/health', '/auth/google', '/auth/google/callback'],
  });

  // Swagger documentation (non-production)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Diamond Factory API')
      .setDescription(
        'Diamond Factory Pvt Ltd — REST API for the luxury diamond ecommerce platform'
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT-auth'
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('diamonds', 'Diamond catalog and search')
      .addTag('products', 'Ring settings and jewelry products')
      .addTag('orders', 'Order management')
      .addTag('payments', 'Payment processing')
      .addTag('cart', 'Shopping cart')
      .addTag('wishlist', 'Wishlist management')
      .addTag('users', 'User profile management')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
      },
    });

    logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 Diamond Factory API running on http://localhost:${port}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap();
