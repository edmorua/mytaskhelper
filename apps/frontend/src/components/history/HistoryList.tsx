'use client';

import { format } from 'date-fns';
import { RotateCcw, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { TodoHistory } from '@/types';

interface Props {
  history: TodoHistory[];
  onReopen: (id: string) => Promise<void>;
  loading: boolean;
}

export function HistoryList({ history, onReopen, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No history yet</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Completed tasks will appear here after the daily reset at midnight.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          className={clsx(
            'card p-4 flex items-start gap-4 animate-fade-in',
            item.reopened && 'opacity-60',
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={clsx('text-sm font-semibold text-gray-900', item.reopened && 'line-through text-gray-500')}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                )}
              </div>
              {!item.reopened && (
                <button
                  onClick={() => onReopen(item.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors"
                  title="Reopen as new task"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reopen
                </button>
              )}
              {item.reopened && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <RefreshCw className="w-3 h-3" />
                  Reopened
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Done {format(new Date(item.completedAt), 'MMM d, yyyy h:mm a')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Archived {format(new Date(item.archivedAt), 'MMM d, yyyy')}
              </span>
              {item.reopenedAt && (
                <span className="flex items-center gap-1 text-brand-500">
                  <RefreshCw className="w-3 h-3" />
                  Reopened {format(new Date(item.reopenedAt), 'MMM d, yyyy h:mm a')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
