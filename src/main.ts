import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
   * Use validation pipes globally
   */
  app.useGlobalPipes(

    new ValidationPipe({
      // the white list will remove any properties that are not in the DTO
      whitelist: true,
      // the forbidNonWhitelisted will throw an error if any properties are not in the DTO
      forbidNonWhitelisted: true,
      // the transform will transform the payloads to be objects of the DTO classes
      transform: true,
      // transform options 
      transformOptions: {

        // in the DTO we have @Type(() => Number)
        // This will allow the transformation of the data to the correct type
        // This is useful when the data is not in the correct type
        // For example, if the data is a string, it will be converted to a number
        // If the data is a string, it will be converted to a number
        enableImplicitConversion: true,
      }

    }));

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller.
    )
    .build();
  // Inst
  // antiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const ENV = process.env.NODE_ENV;


  console.log(`Environment: ${ENV}`); // This will log the current environment

  // swagger will be available on this url:
  // http://localhost:3000/api


  // the u se of cors is to allow the frontend to access the backend
  // without it the browser will block the requests
  // because of the same origin policy
  // in production we will use a more secure way to allow only the frontend domain
  // to access the backend

  // without it the frontend will not be able to access the backend cuz of the same origin policy
  // the same origin policy is a security feature implemented by browsers to prevent malicious websites from accessing resources on other domains without permission

  app.enableCors()
  await app.listen(3000,);
}
bootstrap();
