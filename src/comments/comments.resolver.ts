import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDTO } from './comment.dto';
import { CommentsService } from './comments.service';

@Resolver()
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Query()
  async comment(@Args('id') id: string) {
    return await this.commentsService.show(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createComment(
    @Args('idea') ideaId: string,
    @Args('comment') comment: string,
    @Context('user') user: any,
  ) {
    const { id: userId } = user;
    const data: CommentDTO = { comment };

    return await this.commentsService.create(ideaId, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteComment(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.commentsService.destroy(id, userId);
  }
}
