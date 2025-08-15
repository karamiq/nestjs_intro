import { IsDate, IsOptional } from "class-validator";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";
class GetPostsBaseDto {
  @IsDate()
  @IsOptional()
  // @Type(() => Date)
  // the type is not needed because we have enableImplicitConversion: true in the main.ts file
  startDate?: Date;

  @IsDate()
  @IsOptional()
  // @Type(() => Date)
  // the type is not needed because we have enableImplicitConversion: true in the main.ts file
  endDate?: Date;
}
// IntersectionType is used to combine multiple DTOs into one
// In this case, we are combining the GetPostsBaseDto and PaginationQueryDto DTOs
// This is useful when we want to get the posts and the pagination query at the same time
export class GetPostsDto extends IntersectionType(GetPostsBaseDto, PaginationQueryDto) {
}