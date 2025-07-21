import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
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
  ) { }

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      existingUser = await this.usersRepository.findOne({

        where: { email: createUserDto.email },
      });
    } catch (error) {
      Error.captureStackTrace(error);
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later',
        {
          cause: error,
          description: 'Database connection timeout',
        }
      );

    }
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    /**
     * Handle exceptions if user exists later
     * */

    // Try to create a new user
    // - Handle Exceptions Later
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    console.log("User created successfully");

    // Create the user
    return newUser;
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    console.log(this.profileConfigureation);
    let users = this.usersRepository.find();
    return users
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public findOneById(id: number) {
    return this.usersRepository.findOneBy({
      id
    });
  }
}
