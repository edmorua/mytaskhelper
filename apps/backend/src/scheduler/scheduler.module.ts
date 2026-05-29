import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TodosModule } from '../todos/todos.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TodosModule, HistoryModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
