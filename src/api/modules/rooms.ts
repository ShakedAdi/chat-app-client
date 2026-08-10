import api from '../client';

export const RoomType = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export interface Room {
  id: string;
  type: RoomType;
  name: string;
}

export interface CreateDmResponse {
  id: string;
  createdAt: string;
}

export async function getRooms(): Promise<Room[]> {
  const { data } = await api.get<Room[]>('/rooms');
  return data;
}

export async function createDirect(
  otherUsername: string,
): Promise<CreateDmResponse> {
  const { data } = await api.post<CreateDmResponse>(
    `/rooms/dm/${encodeURIComponent(otherUsername)}`,
  );
  return data;
}
