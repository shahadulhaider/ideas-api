import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserRO } from './user.ro';
import { Idea } from 'src/ideas/idea.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @OneToMany(
    type => Idea,
    idea => idea.author,
  )
  ideas: Idea[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { username, id } = this;
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  toResponseObject(showToken = true): UserRO {
    const { id, created, username, token } = this;
    const resObj: any = { id, created, username };
    if (showToken) {
      resObj.token = token;
    }
    if (this.ideas) {
      resObj.ideas = this.ideas;
    }
    return resObj;
  }
}
