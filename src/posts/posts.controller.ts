import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './providers/posts.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    /*
     *  Injecting Posts Service
     */
    private readonly postsService: PostService,
  ) { }

  /*
   * GET localhost:3000/posts/:userId
   */
  @Auth(AuthType.None)
  @Get('/:userId?')
  public getPosts(@Param('userId') userId: string, @Query() getPostsDto: GetPostsDto) {
    return this.postsService.findAll(getPostsDto, userId);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @ApiBearerAuth('JWT-auth')
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() activeUser: ActiveUserData) {
    console.log(activeUser);
    //return this.postsService.create(createPostDto);

    return this.postsService.create(createPostDto, activeUser);
  }

  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the post is updated successfully',
  })
  @ApiBearerAuth('JWT-auth')
  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDto) {
    return this.postsService.update(patchPostsDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
