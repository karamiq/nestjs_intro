import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto as AccessTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
@Injectable()
export class RefreshTokenProvider {
    constructor(

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        private readonly generateTokensProvider: GenerateTokensProvider,
    ) { }
    public async accessTokens(accessTokenDto: AccessTokenDto) {

        try {
            // Verify the refresh token using the JWT service

            //* the pick is just to ensure we only get the sub field from the token
            //* and to declare the type of the payload, it can work without it tho

            // the reson we use verifyAsync is to ensure that the token is valid and not expired
            const payload = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(accessTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                issuer: this.jwtConfiguration.issuer,
                audience: this.jwtConfiguration.audience,

                // Only accept refresh tokens (HS512) - this prevents access tokens from being used here
                algorithms: ['HS512'], // Ensure it's a refresh token by checking the algorithm
            });

            // Extract the user ID from the token
            const { sub } = payload;

            // fetch user from database
            const user = await this.usersService.findOneById(sub);

            // Generate only a new access token using the refresh token
            // This is more secure as refresh tokens should have longer lifespans
            const accessToken = await this.generateTokensProvider.generateAccessToken(user);

            return {
                accessToken,
                // We could optionally return a new refresh token here if implementing token rotation
                // refreshToken: await this.generateTokensProvider.generateRefreshToken(user)
            };
        } catch (error) {
            // Re-throw our custom exception if it's already an UnauthorizedException
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid refresh token');
        }

    }
}
