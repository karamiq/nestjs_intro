import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
// the reasone we implement OnModuleInit is to initialize the oauth client when the module is initialized
// and we're not using the constructor cuz we might need to do some async operations in the future
// which is not possible in the constructor
export class GoogleAuthenticationService implements OnModuleInit {
    // We declare oauthClient here but don't initialize it yet.
    // This is safer because we wait until the module lifecycle is ready.
    private oauthClient: OAuth2Client;
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        private readonly generaeTokensProvider: GenerateTokensProvider,
    ) { }

    // onModuleInit is the recommended place to run initialization logic
    // because it’s called after the constructor, when all dependencies
    // have been properly injected and are safe to use.
    // Unlike the constructor, this can also be async if needed.

    // ist like the init function in stateful widgets in flutter when we want to do some 
    // initialization work before the page is loaded such as fetching data from an api
    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientSecret;

        // Initialize the Google OAuth client here with the injected config.
        // This is cleaner, avoids referencing DI tokens before they're ready,
        // and keeps the constructor free of logic.
        this.oauthClient = new OAuth2Client({
            clientId,
            clientSecret,
        });

    }

    public async authenticate(googleTokenDto: GoogleTokenDto) {
        try {
            // Verify the Google ID token
            const loginTicket = await this.oauthClient.verifyIdToken({
                idToken: googleTokenDto.token,
                audience: this.jwtConfiguration.googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
            });
            // extrac the payload from the Google JWT
            const { email, sub: googleId,

                given_name: firstName, family_name: lastName
            } = loginTicket.getPayload();

            // find the user in the database using the GoogleId
            const user = await this.usersService.findOneByGoogleId(googleId);
            // if google id existed then generate token
            if (user) {
                console.log('Existing user found with Google ID:', user);
                return this.generaeTokensProvider.generateTokens(user);
            }
            // if not create a new user and then generate tokens
            const newUser = await this.usersService.createGoogleUser({ email: email, firstName: firstName, lastName: lastName, googleId: googleId });
            console.log('New user created with Google ID:', newUser);
            return this.generaeTokensProvider.generateTokens(newUser);

        } catch (error) {
            // throw unauthorized exception
            throw new UnauthorizedException(error);

        }

    }
}
