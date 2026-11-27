import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsIn(['TODO', 'DOING', 'DONE'])
  status: 'TODO' | 'DOING' | 'DONE';
}
