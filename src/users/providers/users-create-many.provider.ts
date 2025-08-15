import { ConflictException, HttpException, HttpStatus, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /*
   * Injecting DataSource to create query runner
   */

    private readonly dataSource: DataSource) {
  }
  public async createManyUsers(createUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    let queryRunner = this.dataSource.createQueryRunner();
    try {
      // connect query runner to datasource
      await queryRunner.connect()
      // start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(error.message);
    }

    try {
      // create new users
      for (let user of createUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let reuslt = await queryRunner.manager.save(newUser);
        newUsers.push(reuslt);
      }
      // if successful commit
      await queryRunner.commitTransaction();
    } catch (error) {

      // if unsuccessful roolback
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        "Couldn't complete the transaction", {
        description: error.message
      })
      throw error;
    } finally {

      try {
        // release query runner
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(error.message,
          {
            description: "Couldn't release the query runner"
          }
        );
      }

    }
    return newUsers;
  }
}
