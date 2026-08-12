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

export interface CreateGroupResponse {
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

export async function createGroup(
  name: string,
  members: string[],
): Promise<CreateGroupResponse> {
  const { data } = await api.post<CreateGroupResponse>('/rooms/group', {
    name,
    members,
  });
  return data;
}
