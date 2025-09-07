import {
  CanActivate,                // Interface that all guards must implement
  ExecutionContext,           // Object describing the current execution (controller, handler, etc.)
  Injectable,                 // Marks this class as injectable for NestJS DI
  UnauthorizedException       // Exception for unauthorized access (HTTP 401)
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Helper to read metadata set by decorators
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants'; // Key to store/retrieve auth type metadata
import { AuthType } from 'src/auth/enums/auth-type.enum'; // Enum for available authentication types
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard'; // Guard for bearer token auth

@Injectable()
export class AuthenticationGuard implements CanActivate {

  // Default authentication type if no @Auth() decorator is present
  private static readonly defaultAuthType: AuthType = AuthType.Bearer;

  /**
   * Map each AuthType to its corresponding guard or guards.
   * Record<AuthType, CanActivate | CanActivate[]> means:
   *  - Keys: AuthType values
   *  - Values: A single guard or an array of guards
   */
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
    // For Bearer authentication, use the AccessTokenGuard instance
    [AuthType.Bearer]: this.accessTokenGuard,

    // For None authentication, allow all requests by returning true
    [AuthType.None]: {
      canActivate: (): boolean => true
    },
  };

  constructor(
    private readonly reflector: Reflector,          // Used to read route/controller metadata
    private readonly accessTokenGuard: AccessTokenGuard, // Injected instance of the bearer token guard
  ) { }

  /**
   * The main guard method that determines if a request can proceed.
   * @param context - ExecutionContext (contains info about request, handler, controller)
   * @returns Promise<boolean> - true if request passes authentication, otherwise throws error
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {

    /**
     * Step 1: Read the authentication types from the route or controller metadata.
     *  the @Auth() decorator sets metadata on the route or controller.
     * - getAllAndOverride<T>(key, targets[]) checks metadata on the route first, then the controller.
     * - If nothing found, fallback to [defaultAuthType] (Bearer).
     */
    const authTypes: AuthType[] = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [
        // The order of targets matters:
        // 1. Route handler (e.g., createManyUsers) which is the method being called
        // 2. Controller class (e.g., UsersController) which is the class contains the method
        context.getHandler(), // Method (e.g., createManyUsers)
        context.getClass(),   // Controller class (e.g., UsersController)
      ],
    ) ?? [AuthenticationGuard.defaultAuthType];

    /**
     * Step 2: Get the guards for each AuthType.
     * - authTypeGuardMap[authType] could return a guard or an array of guards.
     * - flat() ensures we end up with a single array of guards.
     */
    const guards: CanActivate[] = authTypes
      .map((authType: AuthType) => this.authTypeGuardMap[authType])
      .flat() as CanActivate[];

    /**
     * Step 3: Prepare the default Unauthorized error
     * This will be thrown if no guard authorizes the request.
     */
    const error: UnauthorizedException = new UnauthorizedException();

    /**
     * Step 4: Iterate through each guard
     */
    for (const guard of guards) {
      /**
       * Execute the guard's canActivate method.
       * - Promise.resolve(...) ensures that it works with both sync and async guards.
       * - catch(...) → If the guard throws an error, throw UnauthorizedException instead.
       */
      const canActivateResult = await Promise.resolve(
        guard.canActivate(context) // Returns boolean | Promise<boolean> | Observable<boolean>
      ).catch(() => {
        throw error;
      });

      /**
       * If any guard returns true → allow the request immediately.
       */
      if (canActivateResult) {
        return true;
      }
    }

    /**
     * Step 5: If no guard passed, throw UnauthorizedException
     */
    throw error;
  }
}
