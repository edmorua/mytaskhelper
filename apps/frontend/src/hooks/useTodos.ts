'use client';

import useSWR from 'swr';
import { todosApi } from '@/lib/api';
import { Todo, TodoStatus } from '@/types';

const fetcher = () => todosApi.list();

export function useTodos() {
  const { data, error, mutate, isLoading } = useSWR<Todo[]>('/todos', fetcher, {
    refreshInterval: 30_000,
  });

  const createTodo = async (title: string, description?: string, status?: TodoStatus) => {
    const todo = await todosApi.create({ title, description, status });
    await mutate();
    return todo;
  };

  const updateTodo = async (id: string, data: { title?: string; description?: string; status?: TodoStatus }) => {
    const todo = await todosApi.update(id, data);
    await mutate();
    return todo;
  };

  const deleteTodo = async (id: string) => {
    await todosApi.remove(id);
    await mutate();
  };

  const moveTodo = async (id: string, status: TodoStatus) => {
    await todosApi.update(id, { status });
    await mutate();
  };

  return {
    todos: data || [],
    loading: isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    moveTodo,
    refresh: mutate,
  };
}
