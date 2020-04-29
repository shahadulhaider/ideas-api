import {
  Args,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { CommentsService } from 'src/comments/comments.service';
import { IdeasService } from './ideas.service';

@Resolver()
export class IdeasResolver {
  constructor(
    private ideasService: IdeasService,
    private commentsService: CommentsService,
  ) {}

  @Query()
  ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return this.ideasService.getAll(page, newest);
  }

  @ResolveProperty()
  comments(@Parent() idea: any) {
    const { id } = idea;
    return this.commentsService.showCommentsByIdea(id);
  }
}
