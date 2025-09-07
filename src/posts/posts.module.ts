import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  controllers: [PostsController],
  providers: [PostService, CreatePostProvider],
  // the imports array is used to import other modules
  // so we can use the UsersService in the PostsService
  // and also we need to import the TypeOrmModule to use the Post and MetaOption entities
  imports: [TagsModule, UsersModule, PaginationModule, TypeOrmModule.forFeature([Post, MetaOption])],
})
export class PostsModule { }