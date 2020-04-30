import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from 'src/ideas/idea.entity';
import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
