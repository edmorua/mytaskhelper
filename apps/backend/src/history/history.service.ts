import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoHistory } from './entities/todo-history.entity';
import { Todo } from '../todos/entities/todo.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(TodoHistory)
    private repo: Repository<TodoHistory>,
  ) {}

  async archiveTodos(todos: Todo[]): Promise<void> {
    const records = todos.map((todo) =>
      this.repo.create({
        originalTodoId: todo.id,
        title: todo.title,
        description: todo.description,
        userId: todo.userId,
        completedAt: todo.completedAt || new Date(),
      }),
    );
    await this.repo.save(records);
  }

  async findForUser(userId: string): Promise<TodoHistory[]> {
    return this.repo.find({
      where: { userId },
      order: { archivedAt: 'DESC' },
    });
  }

  async reopen(id: string, userId: string): Promise<TodoHistory> {
    const record = await this.repo.findOne({ where: { id, userId } });
    if (!record) throw new NotFoundException('History record not found');

    record.reopened = true;
    record.reopenedAt = new Date();
    return this.repo.save(record);
  }
}
