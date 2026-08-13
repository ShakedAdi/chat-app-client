import api from '../client';
import type {
  CreateDmResponse,
  CreateGroupResponse,
  RoomDetails,
  Room,
} from '../types';

export async function getRooms(): Promise<Room[]> {
  const { data } = await api.get<Room[]>('/rooms');
  return data;
}

export async function getRoomDetails(roomId: string): Promise<RoomDetails> {
  const { data } = await api.get<RoomDetails>(
    `/rooms/details/${encodeURIComponent(roomId)}`,
  );
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
