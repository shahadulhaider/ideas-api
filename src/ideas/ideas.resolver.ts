import {
  Args,
  Context,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
  Mutation,
} from '@nestjs/graphql';
import { CommentsService } from 'src/comments/comments.service';
import { IdeasService } from './ideas.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { IdeaDto } from './idea.dto';

@Resolver()
export class IdeasResolver {
  constructor(
    private ideasService: IdeasService,
    private commentsService: CommentsService,
  ) {}

  @Query()
  async ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return await this.ideasService.getAll(page, newest);
  }

  @Query()
  async idea(@Args('id') id: string) {
    return await this.ideasService.read(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async createIdea(
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: any,
  ) {
    const { id: userId } = user;
    const data: IdeaDto = { idea, description };
    return await this.ideasService.create(userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async updateIdea(
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('description') description: string,
    @Context('user') user: any,
  ) {
    const { id: userId } = user;
    const data: IdeaDto = { idea, description };
    return await this.ideasService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async deleteIdea(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.ideasService.destroy(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async upvote(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.ideasService.upvote(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async downvote(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.ideasService.downvote(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async bookmark(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.ideasService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  async unbookmark(@Args('id') id: string, @Context('user') user: any) {
    const { id: userId } = user;
    return await this.ideasService.unbookmark(id, userId);
  }

  @ResolveProperty()
  async comments(@Parent() idea: any) {
    const { id } = idea;
    return await this.commentsService.showCommentsByIdea(id);
  }
}
