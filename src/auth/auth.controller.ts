import { AuthService } from './providers/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
  ) { }

  @Post('/sign-in')
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/sign-up')
  public async signUp() {

  }
}
