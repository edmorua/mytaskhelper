'use client';

import { History } from 'lucide-react';
import { format } from 'date-fns';
import { HistoryList } from '@/components/history/HistoryList';
import { useHistory } from '@/hooks/useHistory';

export default function HistoryPage() {
  const { history, loading, reopen } = useHistory();

  const totalDone = history.length;
  const reopened = history.filter((h) => h.reopened).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Task History</h1>
            <p className="text-sm text-gray-500">All completed tasks archived at midnight</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{totalDone}</div>
            <div className="text-xs text-gray-500">Total done</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-brand-500">{reopened}</div>
            <div className="text-xs text-gray-500">Reopened</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <HistoryList history={history} onReopen={reopen} loading={loading} />
      </div>
    </div>
  );
}
