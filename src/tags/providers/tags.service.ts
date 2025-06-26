import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {

  constructor(

    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) { }

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);

  }

  public async findMultipleTagsByIds(tagIds: number[]) {
    let result = await this.tagsRepository.find({
      where: {
        // the In() function allows us to find multiple records by their IDs
        // this is useful when we want to find multiple tags by their IDs
        // its provided by TypeORM
        id: In(tagIds),
      },
    });
    return result;
  }


  public async findAll() {
    return await this.tagsRepository.find();
  }

  public async delete(id: number) {
    // This will soft delete the tag by setting the deletedAt column to the current date
    // if you want to hard delete the tag, you can use the remove() method instead
    await this.tagsRepository.delete(id);
    return {
      deleted: true,
      id,
      message: 'Tag deleted successfully',
    }

  }

  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return {
      deleted: true,
      id,
      message: 'Tag soft deleted successfully',
    }
  }
}
