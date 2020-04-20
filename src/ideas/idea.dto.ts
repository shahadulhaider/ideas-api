import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class IdeaDto {
  @IsNotEmpty()
  @IsString()
  idea: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
