import api from '../client';
import { MESSAGE_PAGE_SIZE } from '../../constants';
import type { Message, SendMessageResponse } from '../types';

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
