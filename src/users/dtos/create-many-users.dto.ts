import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateManyUsersDto {
  @ApiProperty({
    type: 'array',
    required: true,
    description: 'Array of users to create',
    example: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123#'
      }
    ]

  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}   