import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRO } from './user.ro';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(page: number = 1): Promise<UserRO[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return users.map(user => user.toResponseObject(false));
  }

  async read(username: string) {
    const user = await this.userRepository.findOne(
      { username },
      { relations: ['ideas', 'bookmarks'] },
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.toResponseObject(false);
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ username });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
