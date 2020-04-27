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
  OneToMany,
} from 'typeorm';
import { Comment } from 'src/comments/comment.entity';

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
    _type => User,
    author => author.ideas,
  )
  author: User;

  @ManyToMany(_type => User, { cascade: true })
  @JoinTable()
  upvotes: User[];

  @ManyToMany(_type => User, { cascade: true })
  @JoinTable()
  downvotes: User[];

  @OneToMany(
    _type => Comment,
    comment => comment.idea,
    { cascade: true },
  )
  comments: Comment[];
}
