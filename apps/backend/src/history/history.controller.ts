import { Controller, Get, Post, Param, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HistoryService } from './history.service';
import { TodosService } from '../todos/todos.service';
import { CreateTodoDto } from '../todos/dto/create-todo.dto';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private todosService: TodosService,
  ) {}

  @Get()
  findAll(@Request() req) {
    return this.historyService.findForUser(req.user.id);
  }

  @Post(':id/reopen')
  async reopen(@Param('id') id: string, @Request() req) {
    const record = await this.historyService.reopen(id, req.user.id);

    await this.todosService.create(req.user.id, {
      title: record.title,
      description: record.description,
      status: 'todo',
    });

    return record;
  }
}
