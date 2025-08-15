import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive, isPositive } from "class-validator";

export class PaginationQueryDto {
  @ApiProperty({
    description: 'The limit of items per page',
    type: Number,
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  // the type is not needed because we have enableImplicitConversion: true in the main.ts file
  limit?: number = 10;
  @ApiProperty({
    description: 'The page number',
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  // the type is not needed because we have enableImplicitConversion: true in the main.ts file
  page?: number = 1;

}