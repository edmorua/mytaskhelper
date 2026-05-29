import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Todo } from '../../todos/entities/todo.entity';
import { TodoHistory } from '../../history/entities/todo-history.entity';

export type AuthProvider = 'local' | 'google';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true, select: false })
  verificationToken: string;

  @Column({ type: 'varchar', default: 'local' })
  provider: AuthProvider;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true, select: false })
  refreshToken: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @OneToMany(() => TodoHistory, (history) => history.user)
  history: TodoHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
