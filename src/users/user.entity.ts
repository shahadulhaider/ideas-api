import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRO } from './user.ro';

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
    const { password, token, ...rest } = this;
    if (showToken) {
      return { ...rest, token };
    }
    return { ...rest };
  }
}
