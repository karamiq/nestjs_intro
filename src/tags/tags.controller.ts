import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
  constructor(
    /*
     * Injecting Tags Service
     */
    private readonly tagsService: TagsService,
  ) { }
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  public findAll() {
    return this.tagsService.findAll();
  }

  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }
  // /tags/soft-delete?id=1
  @Delete('soft-delete')
  public async softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softDelete(id);
  }
}
