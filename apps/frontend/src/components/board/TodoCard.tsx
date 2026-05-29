'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Calendar, AlignLeft } from 'lucide-react';
import { Todo, STATUS_COLORS, STATUS_LABELS } from '@/types';

interface Props {
  todo: Todo;
  onClick: (todo: Todo) => void;
}

export function TodoCard({ todo, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { todo },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(todo)}
      className={clsx(
        'card p-3.5 cursor-pointer select-none touch-none',
        'hover:shadow-card-hover transition-shadow duration-150',
        'animate-fade-in group',
        isDragging && 'ring-2 ring-brand-500',
      )}
    >
      {/* Status badge */}
      <span className={clsx('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium mb-2', STATUS_COLORS[todo.status])}>
        {STATUS_LABELS[todo.status]}
      </span>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-brand-600 transition-colors">
        {todo.title}
      </h3>

      {/* Description preview */}
      {todo.description && (
        <div className="flex items-start gap-1.5 mb-2">
          <AlignLeft className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{todo.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>{format(new Date(todo.createdAt), 'MMM d')}</span>
        {todo.completedAt && (
          <>
            <span className="mx-1">·</span>
            <span className="text-green-600 font-medium">Done {format(new Date(todo.completedAt), 'h:mm a')}</span>
          </>
        )}
      </div>
    </div>
  );
}
