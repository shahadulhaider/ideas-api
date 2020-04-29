import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/comment.entity';
import { CommentsService } from 'src/comments/comments.service';
import { User } from 'src/users/user.entity';
import { Idea } from './idea.entity';
import { IdeasController } from './ideas.controller';
import { IdeasResolver } from './ideas.resolver';
import { IdeasService } from './ideas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
  controllers: [IdeasController],
  providers: [IdeasService, IdeasResolver, CommentsService],
})
export class IdeasModule {}
