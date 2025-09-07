import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

// without this decorator the guard will be applied to this route
// because by default the AuthGuard is applied globally to all routes
// so we use this decorator to override the default behavior
// and make this route public
// we set the auth type to none to indicate that this route is public
// and doesn't require any authentication
// this is useful for routes like login and register
// where we don't want to apply any authentication guard
@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
    constructor(

        private readonly googleAuthenticationService: GoogleAuthenticationService,
    ) { }

    @Post()
    public async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
        return this.googleAuthenticationService.authenticate(googleTokenDto);
    }
}