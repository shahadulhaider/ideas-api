import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { IdeaDto } from './idea.dto';
import { IdeasService } from './ideas.service';

@Controller('ideas')
export class IdeasController {
  constructor(private ideasService: IdeasService) {}

  @Get()
  getAllIdeas() {
    return this.ideasService.getAll();
  }

  @Post()
  @UsePipes(CustomValidationPipe)
  createIdea(@Body() data: IdeaDto) {
    return this.ideasService.create(data);
  }

  @Get(':id')
  getIdeaById(@Param('id') id: string) {
    return this.ideasService.read(id);
  }

  @Put(':id')
  @UsePipes(CustomValidationPipe)
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDto>) {
    return this.ideasService.update(id, data);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this.ideasService.destroy(id);
  }
}
