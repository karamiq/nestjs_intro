import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
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

  ) { }

  public async createUser(createUserDto: CreateUserDto) {
    // Check if user with email exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
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
    console.log(this.configService.get<string>('API_KEY'));
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
