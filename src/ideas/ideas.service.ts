import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { IdeaDto } from './idea.dto';
import { Idea } from './idea.entity';
import { IdeaRO } from './idea.ro';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private ideasRepository: Repository<Idea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideasRepository.find({ relations: ['author'] });
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
        relations: ['author'],
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
        relations: ['author'],
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
        relations: ['author'],
      });

      this.ensureOwnership(idea, userId);
      const deleted = await this.ideasRepository.remove(idea);
      return this.toResponseObject(deleted);
    } catch (err) {
      throw new HttpException('Not Fond', HttpStatus.NOT_FOUND);
    }
  }

  private toResponseObject(idea: Idea): IdeaRO {
    const resObj: any = {
      ...idea,
      author: idea.author ? idea.author.toResponseObject(false) : null,
    };
    return resObj;
  }

  private ensureOwnership(idea: Idea, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}
