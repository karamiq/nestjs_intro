import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
   * Use validation pipes globally
   */
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,

    transformOptions: {

      // in the DTO we have @Type(() => Number)
      // This will allow the transformation of the data to the correct type
      // This is useful when the data is not in the correct type
      // For example, if the data is a string, it will be converted to a number
      // If the data is a string, it will be converted to a number
      enableImplicitConversion: true,
    }

  });

  // Use global response interceptor
  const { ResponseInterceptor } = await import('./common/response.interceptor');
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('NestJs Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  // Instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const ENV = process.env.NODE_ENV;
  console.log(`Environment: ${ENV}`); // This will log the current environment
  await app.listen(3000,);
}
bootstrap();
