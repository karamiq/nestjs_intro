import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvider: SignInProvider,
  ) { }

  /**
   * Sign in a user
   * @param signInDto - The sign in dto
   * @returns The user
   */
  public async signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }


}

