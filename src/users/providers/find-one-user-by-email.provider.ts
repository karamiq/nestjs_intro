import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {

  constructor(


    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }


  public async findOneByEmail(email: string) {

    let user: User | null = null;
    try {
      user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException('Something went wrong');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }



}
