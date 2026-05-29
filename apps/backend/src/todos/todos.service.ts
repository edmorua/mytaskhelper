import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  async create(userId: string, dto: CreateTodoDto): Promise<Todo> {
    const todo = this.repo.create({ ...dto, userId, status: dto.status || 'todo' });
    return this.repo.save(todo);
  }

  async findAllForUser(userId: string): Promise<Todo[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id, userId } });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, userId: string, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findById(id, userId);

    const completedAt =
      dto.status === 'done' && todo.status !== 'done'
        ? new Date()
        : dto.status !== 'done' && todo.status === 'done'
          ? null
          : todo.completedAt;

    Object.assign(todo, dto, { completedAt });
    return this.repo.save(todo);
  }

  async remove(id: string, userId: string): Promise<void> {
    const todo = await this.findById(id, userId);
    await this.repo.remove(todo);
  }

  async findDoneTodos(userId?: string): Promise<Todo[]> {
    const where: any = { status: 'done' as TodoStatus };
    if (userId) where.userId = userId;
    return this.repo.find({ where });
  }

  async removeByIds(ids: string[]): Promise<void> {
    if (!ids.length) return;
    await this.repo.delete(ids);
  }
}
