import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';


/**
 * Access Token Guard
 * 
 * This guard is responsible for validating JWT access tokens in incoming requests.
 * It implements the CanActivate interface to determine if a request should be allowed
 * to proceed based on the validity of the provided access token.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  /**
   * Constructor - Initializes the AccessTokenGuard with required dependencies
   */
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
  /**
   * Determines if the current request can activate/proceed
   * 
   * This method is called by NestJS for every request that uses this guard.
   * It extracts and validates the JWT token from the request headers.
   * 
   * @param context - The execution context containing request information
   * @returns Promise<boolean> - true if the request should be allowed, throws exception if not
   * @throws UnauthorizedException - When no token is provided or token is invalid
   */
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Extract the HTTP request from the execution context
    const request = context.switchToHttp().getRequest();
    // Extract the JWT token from the Authorization header
    const token = this.ectractRequestFromHeader(request);

    // Check if token exists in the request
    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      // Verify the JWT token using the configured secret and options
      const payload = await this.jwtService.verifyAsync(token,
        {
          ...this.jwtConfiguration,
          algorithms: ['HS256'], // Only accept access tokens (HS256)
        },

      );

      // Attach the decoded user payload to the request object for later use
      request[REQUEST_USER_KEY] = payload; // Attach the user to the request object
      console.log('Access token payload:', payload);
    } catch (error) {
      // If token verification fails, throw an unauthorized exception
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw our custom exception
      }
      throw new UnauthorizedException('Invalid access token');

    }
    // Return true to allow the request to proceed
    return true
  }
  /**
   * Extracts the JWT token from the Authorization header
   * 
   * This private method parses the Authorization header to extract the JWT token.
   * It expects the header format to be "Bearer <token>" and returns only the token part.
   * 
   * @param request - The Express request object containing headers
   * @returns string | undefined - The extracted token or undefined if not found
   */
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
