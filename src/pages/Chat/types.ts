export const RoomType = {
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
} as const;

export type RoomType = (typeof RoomType)[keyof typeof RoomType];

export interface Room {
  id: string;
  type: RoomType;
  name?: string;
  dmKey?: string;
}
