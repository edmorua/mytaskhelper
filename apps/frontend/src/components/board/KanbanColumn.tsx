'use client';

import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { TodoCard } from './TodoCard';
import { Column, Todo } from '@/types';

interface Props {
  column: Column;
  todos: Todo[];
  onCardClick: (todo: Todo) => void;
  onAddClick: (status: string) => void;
}

export function KanbanColumn({ column, todos, onCardClick, onAddClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl overflow-hidden border border-gray-200 bg-white/60">
      {/* Column header */}
      <div className={clsx('flex items-center justify-between px-4 py-3', column.headerColor)}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold">{column.title}</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/50 text-xs font-bold">
            {todos.length}
          </span>
        </div>
        <button
          onClick={() => onAddClick(column.id)}
          className="rounded p-0.5 hover:bg-white/30 transition-colors"
          title="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 min-h-40 p-2 space-y-2 transition-colors',
          isOver ? 'bg-brand-50' : column.color,
        )}
      >
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <p className="text-xs text-center">No tasks here</p>
            <p className="text-xs text-center">Drag tasks or click +</p>
          </div>
        )}
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
