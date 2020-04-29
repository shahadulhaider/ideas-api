import {
  Args,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { CommentsService } from 'src/comments/comments.service';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private commentsService: CommentsService,
  ) {}

  @Query()
  users(@Args('page') page: number) {
    return this.usersService.getAllUsers(page);
  }

  @ResolveProperty()
  comments(@Parent() user: any) {
    const { id } = user;
    return this.commentsService.ShowCommentsByUser(id);
  }
}
