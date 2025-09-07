import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

/**
 * This provider is responsible for creating a new user
 * it's used in the users service to create a new user
 * it's also used in the auth service to create a new user
 * it's also used in the users controller to create a new user
 */
@Injectable()
export class CreateUserProvider {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // Injecting HashingProvider

    // since it's a circular dependency, we need to inject it using the Inject decorator
    // and we need to forwardRef to avoid the circular dependency
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    //!-- since the mail module is global we dont need to
    //! import it in the users module
    private readonly mailService: MailService,
  ) { }


  /**
   * This method is responsible for creating a new user
   * it's used in the users service to create a new user
   */
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
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    newUser = await this.usersRepository.save(newUser);
    console.log("User created successfully");

    try {
      await this.mailService.sendUserWelcome(newUser)
      console.log("Welcome email sent successfully");
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to send welcome email at this time, please try again later',
        {
          cause: error,
          description: 'Email service timeout',
        }
      );
    }

    return newUser;
  }
}
