/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/post.entity'
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,

        private readonly tagsService: TagsService,
    ) { }

    public async createPost(createPostDto: CreatePostDto, @ActiveUser('sub') user: ActiveUserData): Promise<any> {
        let author = undefined;
        let tags = undefined;
        try {
            author = await this.usersService.findOneById(user.sub);

            // this step isnt necessary since we are using the ActiveUser decorator
            // so the user cant even reach this point if the user is not even authenticated
            // and if the user is authenticated then the user is already found
            // so this step is illogical
            // if (!author) {
            //     throw new BadRequestException();
            // }

            tags = await this.tagsService.findMultipleTagsByIds(createPostDto.tags);
            if (createPostDto.tags.length !== tags.length) {
                throw new BadRequestException('Please check your tag ids');
            }
        } catch (error) {
            throw new ConflictException('User or tags not found'); // this is a more appropriate exception
        }
        let post = this.postsRepository.create({
            ...createPostDto,
            author,
            tags,
        });
        try {
            post = await this.postsRepository.save(post);
        } catch (error) {
            throw new ConflictException('Ensure post slug is unique and not a duplicate');
        }
        return post;
    }
}
