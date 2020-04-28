import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { User } from '../shared/user.decorator';
import { IdeaDto } from './idea.dto';
import { IdeasService } from './ideas.service';

@Controller('ideas')
export class IdeasController {
  constructor(private ideasService: IdeasService) {}
  private logger = new Logger('IdeasController');

  @Get()
  getAllIdeas(@Query('page') page: number) {
    return this.ideasService.getAll(page);
  }

  @Get('/newest')
  getAllNewestIdeas(@Query('page') page: number) {
    return this.ideasService.getAll(page, true);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(CustomValidationPipe)
  createIdea(@User('id') user: string, @Body() data: IdeaDto) {
    this.logData({ user, data });
    return this.ideasService.create(user, data);
  }

  @Get(':id')
  getIdeaById(@Param('id') id: string) {
    return this.ideasService.read(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(CustomValidationPipe)
  updateIdea(
    @Param('id') id: string,
    @User('id') user: string,
    @Body() data: Partial<IdeaDto>,
  ) {
    this.logData({ id, user, data });
    return this.ideasService.update(id, user, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user });
    return this.ideasService.destroy(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard)
  bookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, user: userId });
    return this.ideasService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard)
  unbookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, user: userId });
    return this.ideasService.unbookmark(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(AuthGuard)
  upvoteIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, user: userId });
    return this.ideasService.upvote(id, userId);
  }

  @Post(':id/downvote')
  @UseGuards(AuthGuard)
  downvoteIdea(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, user: userId });
    return this.ideasService.downvote(id, userId);
  }

  private logData(options: any) {
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.data && this.logger.log('DATA ' + JSON.stringify(options.data));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }
}
