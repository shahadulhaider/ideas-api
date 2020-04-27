import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Idea } from 'src/ideas/idea.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  comment: string;

  @ManyToOne(_type => User)
  @JoinTable()
  author: User;

  @ManyToOne(
    _type => Idea,
    idea => idea.comments,
  )
  idea: Idea;
}
