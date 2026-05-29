'use client';

import { useState, useEffect, FormEvent } from 'react';
import { format } from 'date-fns';
import { X, Trash2, Loader2, Edit2, Check, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { Todo, TodoStatus, STATUS_LABELS, STATUS_COLORS, COLUMNS } from '@/types';

interface Props {
  todo: Todo | null;
  onClose: () => void;
  onUpdate: (id: string, data: { title?: string; description?: string; status?: TodoStatus }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoModal({ todo, onClose, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>('todo');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setStatus(todo.status);
      setEditing(false);
    }
  }, [todo]);

  if (!todo) return null;

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await onUpdate(todo.id, { title, description, status });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: TodoStatus) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await onUpdate(todo.id, { status: newStatus });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await onDelete(todo.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <span className={clsx('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', STATUS_COLORS[status])}>
            {STATUS_LABELS[status]}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(!editing)} className="btn-ghost p-1.5 rounded" title="Edit">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} disabled={deleting} className="btn-ghost p-1.5 rounded text-red-500 hover:bg-red-50" title="Delete">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Title */}
          {editing ? (
            <input
              className="input text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          ) : (
            <h2 className="text-xl font-bold text-gray-900">{todo.title}</h2>
          )}

          {/* Status selector */}
          <div>
            <label className="label">Status</label>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleStatusChange(col.id)}
                  disabled={saving}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all',
                    status === col.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-transparent bg-gray-100 text-gray-600 hover:border-gray-300',
                  )}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            {editing ? (
              <textarea
                className="input resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed min-h-[60px]">
                {todo.description || <span className="text-gray-400 italic">No description</span>}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 text-xs text-gray-400 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {format(new Date(todo.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
            {todo.completedAt && (
              <div className="flex items-center gap-1.5 text-green-600">
                <Check className="w-3.5 h-3.5" />
                <span>Completed {format(new Date(todo.completedAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
          </div>

          {/* Save button when editing */}
          {editing && (
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
