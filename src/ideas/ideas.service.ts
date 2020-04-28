import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { IdeaDto } from './idea.dto';
import { Idea } from './idea.entity';
import { IdeaRO } from './idea.ro';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private ideasRepository: Repository<Idea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(page: number = 1, newest?: boolean): Promise<IdeaRO[]> {
    const ideas = await this.ideasRepository.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
      take: 25,
      skip: 25 * (page - 1),
      order: newest && { created: 'DESC' },
    });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: string, data: IdeaDto): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ id: userId });
    const idea = this.ideasRepository.create({ ...data, author: user });
    await this.ideasRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaRO> {
    try {
      const idea = await this.ideasRepository.findOne(id, {
        relations: ['author', 'upvotes', 'downvotes', 'comments'],
      });
      return this.toResponseObject(idea);
    } catch (err) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    id: string,
    userId: string,
    data: Partial<IdeaDto>,
  ): Promise<IdeaRO> {
    try {
      const idea = await this.ideasRepository.findOne(id, {
        relations: ['author', 'comments'],
      });

      this.ensureOwnership(idea, userId);
      const updated = await this.ideasRepository.save({ ...idea, ...data });
      return this.toResponseObject(updated);
    } catch (err) {
      throw new HttpException('Not Fond', HttpStatus.NOT_FOUND);
    }
  }

  async destroy(id: string, userId: string): Promise<any> {
    try {
      const idea = await this.ideasRepository.findOne(id, {
        relations: ['author', 'comments'],
      });

      this.ensureOwnership(idea, userId);
      const deleted = await this.ideasRepository.remove(idea);
      return this.toResponseObject(deleted);
    } catch (err) {
      throw new HttpException('Not Fond', HttpStatus.NOT_FOUND);
    }
  }

  async bookmark(id: string, userId: string) {
    const idea = await this.ideasRepository.findOne(id);
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ['bookmarks'] },
    );

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(false);
  }

  async unbookmark(id: string, userId: string) {
    const idea = await this.ideasRepository.findOne(id);
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ['bookmarks'] },
    );

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        'Idea already unbookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject(false);
  }

  async upvote(id: string, userId: string) {
    let idea = await this.ideasRepository.findOne(id, {
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ id: userId });

    idea = await this.vote(idea, user, Votes.UP);
    return this.toResponseObject(idea);
  }

  async downvote(id: string, userId: string) {
    let idea = await this.ideasRepository.findOne(id, {
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userRepository.findOne({ id: userId });

    idea = await this.vote(idea, user, Votes.DOWN);
    return this.toResponseObject(idea);
  }

  private async vote(idea: Idea, user: User, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id !== user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);

      await this.ideasRepository.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideasRepository.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  private toResponseObject(idea: Idea): IdeaRO {
    const resObj: any = {
      ...idea,
      author: idea.author ? idea.author.toResponseObject(false) : null,
    };
    if (resObj.upvotes) {
      resObj.upvotes = idea.upvotes.length;
    }
    if (resObj.downvotes) {
      resObj.downvotes = idea.downvotes.length;
    }

    return resObj;
  }

  private ensureOwnership(idea: Idea, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}
