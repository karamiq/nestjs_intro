import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokenProvider } from './providers/access-token.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  imports: [

    forwardRef(() => UsersModule),
    // the reason we use the config module here is to load the jwt configuration
    // so that we can use it in the AuthService and other providers
    // and using them only in the AuthModule
    // other we'd use them in the AppModule
    ConfigModule.forFeature(jwtConfig,

    ),

    // JwtModule.registerAsync waits for config
    //  It imports the JWT config values from step 1.
    //  It uses them to dynamically configure JWT:
    // {
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    // }
    // registerAsync = “Make sure JwtModule is only configured after ConfigModule finishes loading values.”
    //
    JwtModule.registerAsync(jwtConfig.asProvider()),





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
  providers: [
    AuthService,
    // since the HashingProvider is abstract, we need to provide a concrete implementation
    //HashingProvider
    {
      // if someone asks for HashingProvider, provide BcryptProvider
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokenProvider,
    GoogleAuthenticationService,

  ],

  exports: [AuthService, HashingProvider, JwtModule]
})
export class AuthModule { }
