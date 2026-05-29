'use client';

import useSWR from 'swr';
import { historyApi } from '@/lib/api';
import { TodoHistory } from '@/types';

const fetcher = () => historyApi.list();

export function useHistory() {
  const { data, error, mutate, isLoading } = useSWR<TodoHistory[]>('/history', fetcher);

  const reopen = async (id: string) => {
    await historyApi.reopen(id);
    await mutate();
  };

  return {
    history: data || [],
    loading: isLoading,
    error,
    reopen,
    refresh: mutate,
  };
}
