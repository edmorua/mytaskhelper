import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoHistory } from './entities/todo-history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TodosModule } from '../todos/todos.module';

@Module({
  imports: [TypeOrmModule.forFeature([TodoHistory]), TodosModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
