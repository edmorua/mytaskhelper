import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('todo_history')
export class TodoHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalTodoId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamptz' })
  completedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  reopenedAt: Date;

  @Column({ default: false })
  reopened: boolean;

  @CreateDateColumn()
  archivedAt: Date;
}
