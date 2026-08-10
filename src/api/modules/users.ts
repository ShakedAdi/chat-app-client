import api from '../client';

export interface UserSummary {
  username: string;
  displayName: string;
}

export async function searchUsers(search: string): Promise<UserSummary[]> {
  const { data } = await api.get<UserSummary[]>('/users', {
    params: { search },
  });
  return data;
}
