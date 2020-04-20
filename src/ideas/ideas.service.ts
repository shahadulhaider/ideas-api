import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDto } from './idea.dto';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private ideasRepository: Repository<Idea>,
  ) {}

  async getAll(): Promise<Idea[]> {
    return await this.ideasRepository.find();
  }

  async create(data: IdeaDto): Promise<Idea> {
    const idea = this.ideasRepository.create(data);
    await this.ideasRepository.save(idea);
    return idea;
  }
  async read(id: string): Promise<Idea> {
    try {
      const idea = await this.ideasRepository.findOne(id);
      return idea;
    } catch (err) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, data: Partial<IdeaDto>): Promise<Idea> {
    try {
      const idea = await this.ideasRepository.findOne(id);
      return await this.ideasRepository.save({ ...idea, ...data });
    } catch (err) {
      throw new HttpException('Not Fond', HttpStatus.NOT_FOUND);
    }
  }

  async destroy(id: string): Promise<any> {
    try {
      const idea = await this.ideasRepository.findOne(id);
      return await this.ideasRepository.remove(idea);
    } catch (err) {
      throw new HttpException('Not Fond', HttpStatus.NOT_FOUND);
    }
  }
}
