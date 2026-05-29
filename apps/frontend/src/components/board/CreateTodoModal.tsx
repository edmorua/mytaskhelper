'use client';

import { useState, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import { TodoStatus, COLUMNS, STATUS_LABELS } from '@/types';

interface Props {
  initialStatus?: TodoStatus;
  onClose: () => void;
  onCreate: (title: string, description?: string, status?: TodoStatus) => Promise<void>;
}

export function CreateTodoModal({ initialStatus = 'todo', onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onCreate(title.trim(), description.trim() || undefined, status);
      onClose();
    } catch {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Create new task</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              maxLength={255}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              placeholder="Add more details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Initial status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
            >
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || !title.trim()} className="btn-primary">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
