import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';


@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider, CreateUserProvider, FindOneUserByEmailProvider,

    //with adding the AccessTokenGuard to the providers array
    // we can use it to protect the entire module

    // the provide data is like a key when ever a module asks for a guard
    // it will get the AccessTokenGuard
    // and the "APP_GUARD" is the default guard for the entire application
    // so right now we are using the AccessTokenGuard as the default guard for the entire application
    // and even tho we are using it in the users module all of the other modules are effectively using it
    // and this my create a convusion 

    // if we want to protect the entire application with the AccessTokenGuard
    // it's better to use it in the app.module.ts file it would make more sense
    // for other developers to understand that the entire application is protected by the AccessTokenGuard
    // and thats what i did in the app.module.ts file
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // }
  ],
  // adding service to the exports array allows other modules to use it
  // so we can use it in the posts module let's say for asigning the author 
  // of the post
  exports: [UsersService, FindOneUserByEmailProvider],
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => AuthModule),

  // importing ConfigModule to use configuration variables
  // the custom configuration is imported using the registerAs function
  // and the ConfigType is used to inject the configuration into the service
  // it's can be used only in the module where it is imported
  // so we can use it in the users module only
  // if we want to use it in other modules we need to import it in those modules
  // this way we prevent a user config from being used in other modules
  // otherwise it will be available globally
  // and if we want them to be available globally we can use the forRoot method
  ConfigModule.forFeature(profileConfig),

    // JWT configuration is now handled globally in AuthModule
    // No need to configure it again here




    // ?-- * The JwtModule is used to sign and verify JWT tokens
    // * It is used to create and manage JWT tokens for authentication
    // * and authorization purposes without it 
    // * we would not be able to use JWT tokens in our application
    // * it is used in the AuthService to sign and verify JWT tokens
    // * and in the AuthController to protect the routes
    // * and to create the JWT tokens for the user
    // * so it is a crucial part of the authentication process
    // ?-- so you see it's role is more of providing services
  ],
})
export class UsersModule { }
