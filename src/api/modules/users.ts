import api from '../client';
import type { UserSummary } from '../types';

export async function searchUsers(search: string): Promise<UserSummary[]> {
  const { data } = await api.get<UserSummary[]>('/users', {
    params: { search },
  });
  return data;
}
