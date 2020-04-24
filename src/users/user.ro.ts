import { Idea } from 'src/ideas/idea.entity';

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
  ideas?: Idea[];
  bookmarks?: Idea[];
}
