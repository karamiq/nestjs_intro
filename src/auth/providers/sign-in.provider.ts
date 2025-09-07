import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { In } from 'typeorm';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { GenerateTokensProvider } from './generate-tokens.provider';
@Injectable()
export class SignInProvider {

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    /**
     * Inject JWT service
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) { }

  /**
   * Sign in a user
   * @param signInDto - The sign in dto
   * @returns The user
   */
  public async signIn(signInDto: SignInDto) {
    let user = await this.usersService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;

    try {
      isEqual = await this.comparePassword(signInDto.password, user.password);
    } catch (error) {
      throw new RequestTimeoutException('Something went wrong');
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }
    return this.generateTokensProvider.generateTokens(user);

    // generation of token before creating the generateTokensProvider

    // const accessToken = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    // } as ActiveUserData, {
    //   audience: this.jwtConfiguration.audience,
    //   issuer: this.jwtConfiguration.issuer,
    //   secret: this.jwtConfiguration.secret,
    //   expiresIn: this.jwtConfiguration.accessTokenTtl,
    // })
    // return {
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   accessToken,
    // };


  }

  /**
   * Compare a password with a hash
   * @param password - The password
   * @param hash - The hash
   * @returns The result of the comparison
   */
  public async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
