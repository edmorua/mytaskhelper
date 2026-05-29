import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['todo', 'pending', 'in_process', 'done'])
  status?: TodoStatus;
}
