import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) { }

    private async signToken<T>(
        userId: number,
        expiresIn: number,
        payload?: T,
        algorithm: 'HS256' | 'HS512' | 'RS256' = 'HS256', // 👈 default algo
    ): Promise<string> {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                // secret only applied with the refresh toekn only or 
                // you'll put the risk of security on the line
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn,
                algorithm, // 👈 now configurable
            },
        );
    }

    public async generateAccessToken(user: User): Promise<string> {
        return this.signToken<Partial<ActiveUserData>>(
            user.id,
            this.jwtConfiguration.accessTokenTtl,
            {
                email: user.email,
            },
            'HS256', //  access token algo
        );
    }

    public async generateRefreshToken(user: User): Promise<string> {
        return this.signToken<Partial<ActiveUserData>>(
            user.id,
            this.jwtConfiguration.refreshTokenTtl,
            {},
            'HS512', //  refresh token algo (different)
        );
    }

    public async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(user),
            this.generateRefreshToken(user),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}



class user {
    id: number;
}