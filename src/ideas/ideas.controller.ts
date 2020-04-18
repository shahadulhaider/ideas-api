import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeaDto } from './idea.dto';

@Controller('ideas')
export class IdeasController {
  constructor(private ideasService: IdeasService) {}
  @Get()
  getALlIdeas() {
    return this.ideasService.getAll();
  }

  @Post()
  createIdea(@Body() data: IdeaDto) {
    return this.ideasService.create(data);
  }

  @Get(':id')
  getIdeaById(@Param('id') id: string) {
    return this.ideasService.read(id);
  }

  @Put(':id')
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    return this.ideasService.update(id, data);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this.ideasService.destroy(id);
  }
}
