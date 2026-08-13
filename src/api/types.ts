export interface JwtPayload {
  sub: string;
  username: string;
}

export interface UserSummary {
  username: string;
  displayName: string;
}

export const RoomType = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export const MemberRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

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

export interface RoomMember {
  userId: string;
  role: MemberRole;
  user: UserSummary;
}

export interface RoomDetails {
  id: string;
  type: RoomType;
  name: string;
  members: RoomMember[];
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

export interface SendMessageResponse {
  id: string;
  createdAt: string;
}
