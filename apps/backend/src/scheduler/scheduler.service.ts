import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TodosService } from '../todos/todos.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private todosService: TodosService,
    private historyService: HistoryService,
  ) {}

  // Every day at midnight UTC — archive done todos to history and clear them
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveDoneTodos() {
    this.logger.log('Running daily archive of done todos...');

    const doneTodos = await this.todosService.findDoneTodos();
    if (!doneTodos.length) {
      this.logger.log('No done todos to archive.');
      return;
    }

    await this.historyService.archiveTodos(doneTodos);
    await this.todosService.removeByIds(doneTodos.map((t) => t.id));

    this.logger.log(`Archived ${doneTodos.length} todos to history.`);
  }
}
