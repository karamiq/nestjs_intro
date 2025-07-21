import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import appConfig from './config/app.config'
import databaseConfig from './config/database.config';
/**
 * Importing Entities
 * */
import { User } from './users/user.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';


const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      // Makes the configuration available globally
      // otherwise you would have to import ConfigModule in every module
      // that needs access to the configuration

      // This is useful for environment variables and other configurations
      // so it really depends on your use case
      isGlobal: true,
      // Load environment variables from .env file
      // You can specify multiple files, and the last one will override the previous ones
      // This is useful for different environments like development, production, etc.

      //now we can specify the path to the .env file for example
      // envFilePath:'.env.development'
      // like this however in the package.json file we have specified
      // the NODE_ENV variable to be development so there must be a .env.development file
      // otherwise it will not work(give's either an error or undefined values)
      // the envFilePath as an array so that we can use different .env files

      // "start:dev": "NODE_ENV=development nest start --watch",
      // "start:prod": "NODE_ENV=production nest start",
      // ...

      // package.json uses the NODE_ENV of test by default

      // me personally i like to use one .env file for all
      // but it's good to mention just in case dealing with sensitive data
      // like API keys, database credentials, etc.
      // that might screw up your application if not handled properly

      //!--> On WINDOWS when i tried to run the command npm run start:dev
      // where the // package.json uses 
      // "start:dev": "NODE_ENV=development nest start --watch",
      // i run into an error is
      /// 'NODE_ENV' is not recognized as an internal or external command,
      // operable program or batch file.
      // happens because the NODE_ENV=development syntax is Unix-based (Linux/macOS) 
      // and doesn’t work directly on Windows Command Prompt or PowerShell.
      // so i had to use cross-env package to fix this issue
      // so i had to install it using npm install cross-env
      // and then change the package.json file to use cross-env like this
      // "start:dev": "cross-env NODE_ENV=development nest start --watch",

      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],

      // this isthe validation schema for the environment variables
      // it tell what are the required environment variables and 
      // what they're supposed to be
      validationSchema: environmentValidation,

    }),

    //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        // entities: [User],
        // instead of using the entities array, you can use the glob pattern
        autoLoadEntities: config.get<boolean>('database.autoLoadEntities'),
        // These options are for development only
        // and should not be used in production
        synchronize: config.get<boolean>('database.synchronize'),

        // ? instead of using the environment variables directly
        // * you can use the ConfigService to get the values
        // port: parseInt(process.env.DATABASE_PORT, 10),
        // username: process.env.DATABASE_USER,
        // password: process.env.DATABASE_PASSWORD,
        // host: process.env.DATABASE_HOST,
        // database: process.env.DATABASE_NAME,

        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        host: config.get<string>('database.host'),
        database: config.get<string>('database.name'),
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
