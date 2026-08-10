import api from '../client';

export interface CreateDmResponse {
  id: string;
  createdAt: string;
}

export async function createDirect(
  otherUsername: string,
): Promise<CreateDmResponse> {
  const { data } = await api.post<CreateDmResponse>(
    `/rooms/dm/${encodeURIComponent(otherUsername)}`,
  );
  return data;
}
