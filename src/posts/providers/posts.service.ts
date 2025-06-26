import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,
    /*
     * Injecting Posts Repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /*
     * Injecting Meta Options Repository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService
  ) { }

  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author from database based on autherId
    let author = await this.usersService.findOneById(createPostDto.authorId);

    // getting the tags from the database based on the tag ids
    // this will return an array of tags that match the ids in the createPostDto.tags
    let tags = await this.tagsService.findMultipleTagsByIds(createPostDto.tags)

    // Create post
    let post = await this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags
    });




    //? -- Since we enabled cascade in the post.entity.ts this isn't needed anymore
    // the metaOptions will be created automatically when the post is created
    // codes to check if the metaOptions exists or not and create then by hand it will be done automatically

    // //creat metaOptions of it's null
    // let metaOptions = createPostDto.metaOptions ? this.metaOptionsRepository.create(createPostDto.metaOptions) : null;

    // if(metaOptions) {
    //  await this.metaOptionsRepository.save(metaOptions);
    // }
    // //Create Post
    // let post = this.postsRepository.create(createPostDto);
    // // Add metaOptions to the Post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions
    // }
    // // Return the created post
    // return await this.postsRepository.save(post);


    // this is all we need to do to create a post
    // the metaOptions will be created automatically when the post is created
    // thanks to the cascade option in the post.entity.ts file so whe dont need all these
    //// let post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: number) {
    // const user = this.usersService.findOneById(userId);
    // the .find() method returns all posts without the metaOptions
    // if you want to include metaOptions, you can use the .find({ relations: ['metaOptions'] }) method
    // but this will return all posts for all users, not just the posts of the user with the given userId
    // If you want to filter posts by userId, you can use the .find({ where: { userId } }) method
    // but this will return all posts for the user with the given userId
    // If you want to filter posts by userId and include metaOptions, you can use the .find({ where: { userId }, relations: ['metaOptions'] }) method
    let posts = this.postsRepository.find({
      // however, this step can be skipped if you've enabled eager to true
      // by eager: ture in the post.entity.ts file
      // but this can be used if we want to controll the relations we want to include
      relations: {
        // i have the eaver enabled so i dont need to do this
        //   metaOptions: true

        // since i havent enable the eager for the author
        // this step becomes necessary to load the author
        // along the post 
        author: true,
        // same as the metaOptions
        //tags: true
      }
    });
    return posts;
  }
  public async delete(id: number) {
    // SINCE WE ENABLED CASCADE IN THE META OPTION ENTITY
    // THE META OPTIONS WILL BE DELETED AUTOMATICALLY
    // // Find the post
    // const post = await this.postsRepository.findOneBy({id});
    // // Delete the post
    // await this.postsRepository.delete(id);

    // // Delete the metaOptions associated with the post if it exists
    // if (post.metaOptions) {
    //   await this.metaOptionsRepository.delete(post.metaOptions.id);
    // }

    let post = await this.postsRepository.delete(id);


    return { deleted: true, postId: id };
  }

  public async update(patchPostDto: PatchPostDto) {
    // find the tags
    let tags: Tag[] = await this.tagsService.findMultipleTagsByIds(patchPostDto.tags);
    // Find the post
    let post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    // Update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;


    // assign the new tags
    post.tags = tags;
    // Save the post and return
    return await this.postsRepository.save(post);
  }
}
// Uncomment the following code to see how to access the inverse side of the relation

//   const post = await this.postsRepository.findOneBy({id});
// let  inversePost = await this.metaOptionsRepository.find({
//     where: {id: post.metaOptions.id},
//     relations: {
//       post: true
//     }
//   })
//   console.log(inversePost);