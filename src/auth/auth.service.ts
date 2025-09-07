import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenProvider } from './providers/access-token.provider';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvider: SignInProvider,

    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) { }

  /**
   * Sign in a user
   * @param signInDto - The sign in dto
   * @returns The user
   */
  public async signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }


  public async accessTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.accessTokens(refreshTokenDto);
  }
}

