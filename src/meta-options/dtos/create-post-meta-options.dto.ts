import { IsNotEmpty, IsJSON}from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsNotEmpty()
  @IsJSON() 
  metaValue: string;
}
