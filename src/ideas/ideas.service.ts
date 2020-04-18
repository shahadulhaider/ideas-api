import { Injectable } from '@nestjs/common';
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
    return await this.ideasRepository.findOne(id);
  }

  async update(id: string, data: Partial<IdeaDto>): Promise<Idea> {
    await this.ideasRepository.update({ id }, data);
    return await this.ideasRepository.findOne(id);
  }

  async destroy(id: string): Promise<any> {
    await this.ideasRepository.delete({ id });
    return { deleted: true };
  }
}
