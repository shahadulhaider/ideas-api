import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Idea } from 'src/ideas/idea.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentRO } from './comment.ro';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Idea) private ideasRepository: Repository<Idea>,
  ) {}

  async showCommentsByIdea(
    ideaId: string,
    page: number = 1,
  ): Promise<CommentRO[]> {
    const comments = await this.commentsRepository.find({
      where: { ideaId },
      relations: ['comments', 'comments.author', 'comments.idea'],
      take: 25,
      skip: 25 * (page - 1),
    });
    if (!comments) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }
    return comments.map(comment => this.toResponseObject(comment));
  }

  async ShowCommentsByUser(
    userId: string,
    page: number = 1,
  ): Promise<CommentRO[]> {
    const comments = await this.commentsRepository.find({
      where: { author: userId },
      relations: ['author'],
      take: 25,
      skip: 25 * (page - 1),
    });
    if (!comments) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }
    return comments.map(comment => this.toResponseObject(comment));
  }

  async create(
    ideaId: string,
    userId: string,
    data: CommentDTO,
  ): Promise<CommentRO> {
    const idea = await this.ideasRepository.findOne(ideaId);
    const user = await this.usersRepository.findOne(userId);

    const comment = this.commentsRepository.create({
      ...data,
      idea,
      author: user,
    });

    await this.commentsRepository.save(comment);

    return this.toResponseObject(comment);
  }

  async show(id: string): Promise<CommentRO> {
    const comment = await this.commentsRepository.findOne(id, {
      relations: ['idea', 'author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(comment);
  }

  async destroy(id: string, userId: string): Promise<CommentRO> {
    const comment = await this.commentsRepository.findOne(id, {
      relations: ['author', 'idea'],
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.author.id !== userId) {
      throw new HttpException(
        'You do now own this comment',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleted = await this.commentsRepository.remove(comment);
    return this.toResponseObject(deleted);
  }

  private toResponseObject(comment: Comment): CommentRO {
    const resObj: any = {
      ...comment,
      author: comment.author ? comment.author.toResponseObject(false) : null,
    };

    return resObj;
  }
}
