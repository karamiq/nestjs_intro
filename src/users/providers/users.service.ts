import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /*
      * Injecting ConfigService to access configuration variables
      * */
    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfigureation: ConfigType<typeof profileConfig>,

    /*
     * Injecting UsersCreateManyProviderTs to create many users
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // Injecting CreateUserProvider to create a new user
    private readonly createUserProvider: CreateUserProvider,

    // Injecting FindOneUserByEmailProvider to find a user by email
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) { }

  /**
   * Create a new user
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Get all users with pagination
   */
  public async findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find one user by ID
   */
  public async findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Create multiple users in a transaction
   */
  public async createManyUsers(createUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createManyUsers(createUsersDto);
  }


  public async findOneByEmail(email: string) {
    return this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
