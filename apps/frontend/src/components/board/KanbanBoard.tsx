'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TodoCard } from './TodoCard';
import { TodoModal } from './TodoModal';
import { CreateTodoModal } from './CreateTodoModal';
import { Todo, TodoStatus, COLUMNS } from '@/types';
import { useTodos } from '@/hooks/useTodos';

export function KanbanBoard() {
  const { todos, createTodo, updateTodo, deleteTodo, moveTodo, loading } = useTodos();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [createStatus, setCreateStatus] = useState<TodoStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const todosByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = todos.filter((t) => t.status === col.id);
      return acc;
    },
    {} as Record<TodoStatus, Todo[]>,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find((t) => t.id === event.active.id);
    setActiveTodo(todo || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);
    if (!over) return;

    const newStatus = over.id as TodoStatus;
    const todo = todos.find((t) => t.id === active.id);
    if (!todo || todo.status === newStatus) return;

    await moveTodo(todo.id, newStatus);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <span className="text-sm text-gray-500">Loading your board...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-x-auto min-h-full">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              todos={todosByStatus[column.id]}
              onCardClick={setSelectedTodo}
              onAddClick={(status) => setCreateStatus(status as TodoStatus)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTodo && (
            <div className="rotate-2 opacity-90">
              <TodoCard todo={activeTodo} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdate={async (id, data) => {
            await updateTodo(id, data);
            setSelectedTodo((prev) => (prev ? { ...prev, ...data } : null));
          }}
          onDelete={async (id) => {
            await deleteTodo(id);
            setSelectedTodo(null);
          }}
        />
      )}

      {createStatus && (
        <CreateTodoModal
          initialStatus={createStatus}
          onClose={() => setCreateStatus(null)}
          onCreate={createTodo}
        />
      )}
    </>
  );
}
