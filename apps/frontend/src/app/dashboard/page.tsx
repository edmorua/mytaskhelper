'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { CreateTodoModal } from '@/components/board/CreateTodoModal';
import { useTodos } from '@/hooks/useTodos';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { createTodo } = useTodos();
  const [showCreate, setShowCreate] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500">Here&apos;s your board for today</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-auto">
        <KanbanBoard />
      </div>

      {showCreate && (
        <CreateTodoModal
          onClose={() => setShowCreate(false)}
          onCreate={createTodo}
        />
      )}
    </div>
  );
}
