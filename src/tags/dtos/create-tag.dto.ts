import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name:string;

   @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @MinLength(4)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
    })
  slug:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?:string;

   @ApiProperty()
  @IsJSON()
  @IsOptional()
  schema?:string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?:string;
}