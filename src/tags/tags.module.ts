import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Tag } from './tag.entity';
import { TagsService } from './providers/tags.service';

@Module({
  controllers: [TagsController],
  imports: [
    TypeOrmModule.forFeature([Tag]),
  ],
  providers: [TagsService],
  exports: [TagsService], // Exporting TagsService so it can be used in other modules
})
export class TagsModule {}
