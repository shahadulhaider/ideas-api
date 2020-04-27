import { UserRO } from 'src/users/user.ro';
import { IdeaRO } from 'src/ideas/idea.ro';

export class CommentRO {
  id?: string;
  comment: string;
  created: string;
  author: UserRO;
  idea: IdeaRO;
}
