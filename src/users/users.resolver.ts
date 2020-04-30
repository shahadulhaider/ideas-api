import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { CommentsService } from 'src/comments/comments.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserDTO } from './user.dto';
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

  @Query()
  user(@Args('username') username: string) {
    return this.usersService.read(username);
  }

  @Query()
  @UseGuards(AuthGuard)
  whoami(@Context('user') user: any) {
    const { username } = user;
    return this.usersService.read(username);
  }

  @Mutation()
  login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user: UserDTO = { username, password };
    return this.usersService.login(user);
  }

  @Mutation()
  register(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user: UserDTO = { username, password };
    return this.usersService.register(user);
  }

  @ResolveProperty()
  comments(@Parent() user: any) {
    const { id } = user;
    return this.commentsService.ShowCommentsByUser(id);
  }
}
