import api from '../client';
import type {
  CreateDmResponse,
  CreateGroupResponse,
  LeaveGroupResponse,
  RoomDetails,
  Room,
  SystemMessageResponse,
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

export async function deleteDirect(otherUsername: string): Promise<void> {
  await api.delete(`/rooms/dm/${encodeURIComponent(otherUsername)}`);
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

export async function deleteGroup(roomId: string): Promise<void> {
  await api.delete(`/rooms/group/${encodeURIComponent(roomId)}`);
}

export async function addMember(
  roomId: string,
  username: string,
): Promise<SystemMessageResponse> {
  const { data } = await api.post<SystemMessageResponse>(
    `/rooms/group/add-member/${encodeURIComponent(roomId)}`,
    { username },
  );
  return data;
}

export async function removeMember(
  roomId: string,
  username: string,
): Promise<SystemMessageResponse> {
  const { data } = await api.post<SystemMessageResponse>(
    `/rooms/group/remove-member/${encodeURIComponent(roomId)}`,
    { username },
  );
  return data;
}

export async function leaveGroup(roomId: string): Promise<LeaveGroupResponse> {
  const { data } = await api.post<LeaveGroupResponse>(
    `/rooms/group/leave/${encodeURIComponent(roomId)}`,
  );
  return data;
}
