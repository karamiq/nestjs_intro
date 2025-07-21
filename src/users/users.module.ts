import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // adding service to the exports array allows other modules to use it
  // so we can use it in the posts module let's say for asigning the author 
  // of the post
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]),

  // importing ConfigModule to use configuration variables
  // the custom configuration is imported using the registerAs function
  // and the ConfigType is used to inject the configuration into the service
  // it's can be used only in the module where it is imported
  // so we can use it in the users module only
  // if we want to use it in other modules we need to import it in those modules
  // this way we prevent a user config from being used in other modules
  // otherwise it will be available globally
  // and if we want them to be available globally we can use the forRoot method
  ConfigModule.forFeature(profileConfig)


  ],
})
export class UsersModule { }
