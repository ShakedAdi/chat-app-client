import api from '../client';
import { MESSAGE_PAGE_SIZE } from '../../constants';

export interface SendMessageResponse {
  id: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export const MessageType = {
  TEXT: 'TEXT',
  SYSTEM_ADD_MEMBER: 'SYSTEM_ADD_MEMBER',
  SYSTEM_REMOVE_MEMBER: 'SYSTEM_REMOVE_MEMBER',
  SYSTEM_MEMBER_LEAVE: 'SYSTEM_MEMBER_LEAVE',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface MessageUser {
  id: string;
  username: string;
  displayName: string;
}

export interface Message {
  id: string;
  type: MessageType;
  createdAt: string;
  body: string | null;
  actor: MessageUser | null;
  target: MessageUser | null;
}

export async function sendMessage(
  roomId: string,
  text: string,
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>(
    `/messages/new-message/${encodeURIComponent(roomId)}`,
    { text },
  );
  return data;
}

export async function getLastMessages(
  roomId: string,
  amount: number = MESSAGE_PAGE_SIZE,
  offset = 0,
): Promise<Message[]> {
  const { data } = await api.get<Message[]>(
    `/messages/${encodeURIComponent(roomId)}`,
    { params: { amount, offset } },
  );
  return data;
}
