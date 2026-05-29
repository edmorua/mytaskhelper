export type TodoStatus = 'todo' | 'pending' | 'in_process' | 'done';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'local' | 'google';
  emailVerified: boolean;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  userId: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoHistory {
  id: string;
  originalTodoId: string;
  title: string;
  description?: string;
  userId: string;
  completedAt: string;
  reopenedAt?: string;
  reopened: boolean;
  archivedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Column {
  id: TodoStatus;
  title: string;
  color: string;
  headerColor: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-50', headerColor: 'bg-slate-200 text-slate-700' },
  { id: 'pending', title: 'Pending', color: 'bg-amber-50', headerColor: 'bg-amber-200 text-amber-800' },
  { id: 'in_process', title: 'In Progress', color: 'bg-blue-50', headerColor: 'bg-blue-200 text-blue-800' },
  { id: 'done', title: 'Done', color: 'bg-green-50', headerColor: 'bg-green-200 text-green-800' },
];

export const STATUS_LABELS: Record<TodoStatus, string> = {
  todo: 'To Do',
  pending: 'Pending',
  in_process: 'In Progress',
  done: 'Done',
};

export const STATUS_COLORS: Record<TodoStatus, string> = {
  todo: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  in_process: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};
