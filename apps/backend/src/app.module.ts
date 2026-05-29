import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { HistoryModule } from './history/history.module';
import { MailModule } from './mail/mail.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { User } from './users/entities/user.entity';
import { Todo } from './todos/entities/todo.entity';
import { TodoHistory } from './history/entities/todo-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [User, Todo, TodoHistory],
        synchronize: config.get('nodeEnv') !== 'production',
        logging: config.get('nodeEnv') === 'development',
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    TodosModule,
    HistoryModule,
    MailModule,
    SchedulerModule,
  ],
})
export class AppModule {}
