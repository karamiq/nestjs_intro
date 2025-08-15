import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
@Injectable()
export class AccessTokenGuard implements CanActivate {
  // constructor 
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.ectractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload; // Attach the user to the request object
      console.log('Access token payload:', payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');

    }
    return true
  }
  // the request is from express
  private ectractRequestFromHeader(request: Request): string | undefined {
    // the first part is the type of the token, e.g. Bearer
    // the second part is the actual token
    // therefore we ignore the first part
    // that's why we use split(' ') to split the bearer from the token
    const [_, token] = request.headers.authorization?.split(' ') || [];
    return token; // Return the token
  }
}
