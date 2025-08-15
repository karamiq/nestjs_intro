import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Body,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
@ApiTags('Users')
// the guard can be used to protect the entire controller
// not just one endpoint
// @UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
    private readonly createUserProvider: CreateUserProvider,
  ) { }

  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })

  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Post()
  @SetMetadata('authType', 'none')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
  // Since AccessTokenGuard is registered globally, we don't need @UseGuards here
  // The global guard will automatically protect this route

  // @SetMetadata('authType', 'None')
  @Auth(AuthType.None)
  @Post('/create-many')
  public createManyUsers(@Body() createUsersDto: CreateManyUsersDto) {
    return this.usersService.createManyUsers(createUsersDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}

