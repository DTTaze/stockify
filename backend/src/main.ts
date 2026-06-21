import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { INJECTION_TOKEN } from '@shared/constants';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@shared/interceptors/http-logging.interceptor';
import { HttpResponseInterceptor } from '@shared/interceptors/http-response.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('json', { limit: '15mb' });
  app.useBodyParser('urlencoded', { limit: '15mb', extended: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('/v1/api');

  const auditService = app.get(INJECTION_TOKEN.AUDIT_SERVICE);
  app.useGlobalFilters(new AllExceptionsFilter(auditService));
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new HttpResponseInterceptor(),
  );

  if (process.env.ENABLE_CORS === 'true') {
    app.enableCors({
      origin: true,
      methods: '*',
      credentials: true,
    });
  }

  const enableSwagger = process.env.ENABLE_SWAGGER === 'true';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Backend APIs')
      .setDescription('All backend APIs for the product.')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', in: 'header' })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  const port = process.env.PORT;
  const mainUrl = `http://localhost:${port}`;
  await app.listen(port);
  console.log(`Server is listening on ${mainUrl}`);

  if (enableSwagger) {
    console.log(`Swagger API documentation is running on ${mainUrl}/docs`);
  }
}

bootstrap();
