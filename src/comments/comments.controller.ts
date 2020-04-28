import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { CustomValidationPipe } from 'src/shared/custom-validation.pipe';
import { User } from '../shared/user.decorator';
import { CommentDTO } from './comment.dto';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('idea/:id')
  showCommentsByIdea(@Param('id') ideaId: string, @Query('page') page: number) {
    this.logData({ ideaId });
    return this.commentsService.showCommentsByIdea(ideaId, page);
  }

  @Get('user/:id')
  showCommentsByUser(@Param('id') userId: string, @Query('page') page: number) {
    this.logData({ userId });
    return this.commentsService.ShowCommentsByUser(userId, page);
  }

  @Post('idea/:id')
  @UseGuards(AuthGuard)
  @UsePipes(CustomValidationPipe)
  createComment(
    @Param('id') ideaId: string,
    @User('id') userId: string,
    @Body() data: CommentDTO,
  ) {
    this.logData({ ideaId, userId, data });
    return this.commentsService.create(ideaId, userId, data);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    this.logData({ id });
    return this.commentsService.show(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  destroyComment(@Param('id') id: string, @User('id') userId: string) {
    this.logData({ id, userId });
    return this.commentsService.destroy(id, userId);
  }

  private logData(options: any) {
    const logger = new Logger('CommentController');
    if (options.user) return logger.log('USER' + JSON.stringify(options.user));
    if (options.body) return logger.log('BODY' + JSON.stringify(options.body));
    if (options.id) return logger.log('COMMENT' + JSON.stringify(options.id));
  }
}
