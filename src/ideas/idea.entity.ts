import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Idea extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  idea: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(
    type => User,
    author => author.ideas,
  )
  author: User;

  @ManyToMany(type => User, { cascade: true })
  @JoinTable()
  upvotes: User[];

  @ManyToMany(type => User, { cascade: true })
  @JoinTable()
  downvotes: User[];
}
