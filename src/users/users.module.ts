import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/comment.entity';
import { CommentsService } from 'src/comments/comments.service';
import { Idea } from 'src/ideas/idea.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Idea, Comment])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, CommentsService],
})
export class UsersModule {}
