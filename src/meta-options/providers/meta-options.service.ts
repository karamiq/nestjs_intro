import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { MetaOption } from '../meta-option.entity';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
      // meta options repository will be injected here
          @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>
  ) {
   
  }

  
    public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
      let metaOption = this.metaOptionsRepository.create(createPostMetaOptionsDto);
  
      return this.metaOptionsRepository.save(metaOption);
     }
}
